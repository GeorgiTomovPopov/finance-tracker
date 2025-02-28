const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

//temp to see if it starts
console.log("🔥 Server is starting...");

console.log("MONGO_URI:", process.env.MONGO_URI);

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);
const expenseRoutes = require('./routes/expense');
app.use('/expenses', expenseRoutes);


// Test Route
app.get('/', (req, res) => {
  res.send('Finance Tracker API is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


