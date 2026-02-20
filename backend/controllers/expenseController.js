import ExpenseGroup from "../models/ExpenseGroup.js";

// Get all expense groups for a user
export const getExpenseGroups = async (req, res) => {
  try {
    const { userId, status } = req.query;

    let query = {};

    if (userId) {
      query.$or = [
        { createdBy: userId },
        { 'members.email': userId }
      ];
    }

    if (status) {
      query.status = status;
    }

    const groups = await ExpenseGroup.find(query).sort({ createdAt: -1 });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single expense group
export const getExpenseGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await ExpenseGroup.findById(id);

    if (!group) {
      return res.status(404).json({ error: "Expense group not found" });
    }

    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new expense group
export const createExpenseGroup = async (req, res) => {
  try {
    const { groupName, createdBy, members, tripId } = req.body;

    const group = new ExpenseGroup({
      groupName,
      createdBy,
      members: members || [],
      tripId,
      expenses: []
    });

    await group.save();
    res.status(201).json({ message: "Expense group created", group });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add expense to group
export const addExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, paidBy, splitAmong } = req.body;

    const group = await ExpenseGroup.findById(id);

    if (!group) {
      return res.status(404).json({ error: "Expense group not found" });
    }

    group.expenses.push({
      description,
      amount,
      paidBy,
      splitAmong: splitAmong || group.members.map(m => m.name)
    });

    await group.save();
    res.json({ message: "Expense added", group });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove expense from group
export const removeExpense = async (req, res) => {
  try {
    const { id, expenseId } = req.params;

    const group = await ExpenseGroup.findById(id);

    if (!group) {
      return res.status(404).json({ error: "Expense group not found" });
    }

    group.expenses = group.expenses.filter(exp => exp._id.toString() !== expenseId);
    await group.save();

    res.json({ message: "Expense removed", group });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Calculate split for expense group
export const calculateSplit = async (req, res) => {
  try {
    const { id } = req.params;

    const group = await ExpenseGroup.findById(id);

    if (!group) {
      return res.status(404).json({ error: "Expense group not found" });
    }

    // Calculate who owes whom
    const balances = {};

    // Initialize balances for all members
    group.members.forEach(member => {
      balances[member.name] = 0;
    });

    // Process each expense
    group.expenses.forEach(expense => {
      const splitCount = expense.splitAmong.length;
      const amountPerPerson = expense.amount / splitCount;

      // Payer gets positive balance
      balances[expense.paidBy] = (balances[expense.paidBy] || 0) + expense.amount;

      // Each person in split gets negative balance
      expense.splitAmong.forEach(person => {
        balances[person] = (balances[person] || 0) - amountPerPerson;
      });
    });

    // Calculate settlements (who owes whom)
    const settlements = [];
    const creditors = [];
    const debtors = [];

    Object.entries(balances).forEach(([person, balance]) => {
      if (balance > 0.01) {
        creditors.push({ person, amount: balance });
      } else if (balance < -0.01) {
        debtors.push({ person, amount: Math.abs(balance) });
      }
    });

    // Match debtors with creditors
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(debtor.amount, creditor.amount);

      settlements.push({
        from: debtor.person,
        to: creditor.person,
        amount: Math.round(amount * 100) / 100
      });

      debtor.amount -= amount;
      creditor.amount -= amount;

      if (debtor.amount < 0.01) i++;
      if (creditor.amount < 0.01) j++;
    }

    res.json({
      totalAmount: group.totalAmount,
      balances,
      settlements,
      perPerson: Math.round((group.totalAmount / group.members.length) * 100) / 100
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update expense group status
export const updateGroupStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'settled', 'archived'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const group = await ExpenseGroup.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!group) {
      return res.status(404).json({ error: "Expense group not found" });
    }

    res.json({ message: "Status updated", group });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add member to group
export const addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const group = await ExpenseGroup.findById(id);

    if (!group) {
      return res.status(404).json({ error: "Expense group not found" });
    }

    // Check if member already exists
    const exists = group.members.some(m => m.name === name || m.email === email);
    if (exists) {
      return res.status(400).json({ error: "Member already exists" });
    }

    group.members.push({ name, email });
    await group.save();

    res.json({ message: "Member added", group });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
