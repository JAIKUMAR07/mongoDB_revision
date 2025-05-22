// Import required modules
const express = require('express'); // Framework for creating web servers
const app = express(); // Initialize Express app
const userModel = require("./models/user"); // Import Mongoose model for user
const port = 3000; // Define the port number
const cookieParser = require('cookie-parser'); // Middleware to parse cookies from the client
const path = require('path'); // Node.js module for handling file paths
const bcrypt = require('bcrypt'); // Library to hash passwords securely
const jwt = require('jsonwebtoken'); // Library to create and verify JSON Web Tokens (JWT)

// Set EJS as the view engine for rendering frontend templates
app.set("view engine", "ejs");

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Middleware to parse form data from URL-encoded bodies (e.g., from <form> tags)
app.use(express.urlencoded({ extended: true }));

// Serve static files like CSS, JS, images from the "public" folder
app.use(express.static(path.join(__dirname, "public"))); 

// Middleware to parse cookies attached to the client request object
app.use(cookieParser());

// ==================== ROUTES ====================

// Root route: renders the home page
app.get('/', (req, res) => {
  res.render("index"); // Looks for "views/index.ejs"
});

// ================================================
// POST /create - User registration route
// ================================================
app.post('/create', async (req, res) => {
  try {
    // Destructure the data from request body
    let { username, email, password, age } = req.body;

    // Generate a random salt to make the hash unpredictable
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the salt
    const hash = await bcrypt.hash(password, salt);

    // Save user to MongoDB with hashed password
    let createdUser = await userModel.create({
      username,
      email,
      password: hash, // Store hashed password, not plain text
      age
    });

    // Create a JWT token with email as payload, and "shh" as the secret key
    let token = jwt.sign({ email }, "shh");

    // Send the token to the client as a cookie named "token"
    res.cookie("token", token);

    // Respond with the created user (optional: remove password before sending)
    res.send(createdUser);

  } catch (err) {
    // Log error and send a server error message
    console.error("Error in /create:", err);
    res.status(500).send("Something went wrong");
  }
});

// ================================================
// GET /login - Render login form
// ================================================
app.get("/login", function (req, res) {
  res.render("login"); // Looks for "views/login.ejs"
});

// ================================================
// POST /login - Authenticate user credentials
// ================================================
app.post("/login", async function (req, res) {
  try {
    // Find the user by email in the database
    let user = await userModel.findOne({ email: req.body.email });

    // If user not found, return immediately
    if (!user) {
      return res.send("user not found");
    }

    // Compare the entered password with the stored hashed password
    bcrypt.compare(req.body.password, user.password, function (err, result) {
      if (err) {
        // Handle comparison error
        console.error("Error comparing passwords:", err);
        return res.status(500).send("Internal server error");
      }

      if (result) {
        // If passwords match, generate a new JWT token
        let token = jwt.sign({ email: user.email }, "shh");

        // Set the token in a cookie
        res.cookie("token", token);

        // Send success message
        return res.send("Yes, you can login");
      } else {
        // If passwords do not match, send failure message
        return res.send("No, you cannot login");
      }
    });

  } catch (err) {
    // Log login errors
    console.error("Login error:", err);
    res.status(500).send("Internal server error");
  }
});

// ================================================
// GET /logout - Clear token cookie and log out
// ================================================
app.get("/logout", function (req, res) {
  // Clear the token cookie from the user's browser
  res.clearCookie("token");
  res.send("Token cleared"); // Send logout confirmation
});

// ================================================
// Start the server
// ================================================
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
