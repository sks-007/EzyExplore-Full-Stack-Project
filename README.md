# EzyExplorer - Discover India's Hidden Gems

A travel exploration platform that helps users discover destinations, connect with local buddies, plan visits, and share experiences.

## Features

- 🏞️ **Destination Discovery** - Explore beaches, mountains, heritage sites and more
- 👥 **Local Buddies** - Connect with local guides and fellow travelers  
- 📅 **Trip Planning** - Plan and manage your visits
- 💬 **Reviews & Comments** - Share experiences and get recommendations
- 💰 **Expense Tracking** - Track group expenses during trips
- 🔔 **Notifications** - Stay updated on bookings and activities
- ❤️ **Wishlist** - Save your favorite destinations

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **HTML5/CSS3/JavaScript**
- **Responsive Design**
- **Font Awesome** icons

## Project Structure

```
ezyexplorer/
├── backend/          # Node.js Express API
│   ├── models/       # Database models
│   ├── controllers/  # Route controllers
│   ├── routes/       # API routes
│   ├── middleware/   # Custom middleware
│   └── config/       # Database configuration
├── frontend/         # Client-side application
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ezyexplorer
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ezyexplorer
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the Backend Server**
   ```bash
   npm start
   ```

5. **Setup Frontend**
   Open `frontend/finalized ezyexplorer/index.html` in your browser or serve it using a local server.

### Seeding Data

To populate the database with sample data:

```bash
cd backend
npm run seed:all
```

## API Endpoints

- **Authentication**: `/api/auth`
- **Destinations**: `/api/destinations`
- **Bookings**: `/api/bookings`
- **Reviews**: `/api/reviews`
- **Users**: `/api/users`
- **Buddies**: `/api/buddies`
- **Visits**: `/api/visits`
- **Wishlist**: `/api/wishlist`

## Scripts

- `npm start` - Start the development server.
- `npm run dev` - Start with nodemon (auto-restart)
- `npm run prod` - Start production server
- `npm run seed` - Seed basic data
- `npm run seed:destinations` - Seed destination data
- `npm run seed:all` - Seed all data



---

Happy Exploring! 🌟
