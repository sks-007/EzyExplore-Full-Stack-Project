// Add Review System using Local Storage
const addBtn = document.getElementById("add-review-btn");
const popup = document.getElementById("review-popup");
const saveBtn = document.getElementById("save-review-btn");
const cancelBtn = document.getElementById("cancel-review-btn");
const reviewText = document.getElementById("review-text");
const reviewList = document.getElementById("reviews-list");

let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

function renderReviews() {
  reviewList.innerHTML = "";
  if (reviews.length === 0) {
    reviewList.innerHTML = "<p style='color:gray;'>No reviews yet. Be the first!</p>";
    return;
  }
  reviews.forEach((review) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${review.text}</span>${
      review.isLocal ? `<button onclick="deleteReview(${review.id})">Delete</button>` : ""
    }`;
    reviewList.appendChild(li);
  });
}
function saveReviews() {
  localStorage.setItem("reviews", JSON.stringify(reviews));
}
saveBtn?.addEventListener("click", () => {
  const text = reviewText.value.trim();
  if (text === "") return alert("Please write a review!");
  const newReview = { id: Date.now(), text, isLocal: true };
  reviews.push(newReview);
  saveReviews();
  renderReviews();
  reviewText.value = "";
  popup.classList.add("hidden");
});
function deleteReview(id) {
  reviews = reviews.filter((r) => r.id !== id);
  saveReviews();
  renderReviews();
}
cancelBtn?.addEventListener("click", () => {
  popup.classList.add("hidden");
  reviewText.value = "";
});
addBtn?.addEventListener("click", () => {
  popup.classList.remove("hidden");
});
renderReviews();