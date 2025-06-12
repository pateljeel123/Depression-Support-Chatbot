const express = require("express");
const cors = require("cors");
const config = require("./config/config");
const chatRoutes = require("./routes/chatRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Initialize Express app
const app = express();

// Middleware
app.use(
  cors(
    {
    origin: "https://mindcare.deepnex.in/",
    credentials: true
  }
  )
);
app.use(express.json());

// Routes
app.use("/", chatRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log(
    "Depression Support Chatbot API is ready to use with structured responses and follow-up questions"
  );
});
