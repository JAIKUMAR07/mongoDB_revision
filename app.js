// Importing required modules
const express = require('express');
const path = require("path");
const userModel = require('./models/user'); // Your Mongoose model

const app = express();
const port = 3000;

// Setting up middleware and configuration
app.set('view engine', 'ejs'); // Using EJS as the templating engine
app.use(express.json()); // For parsing JSON data
app.use(express.urlencoded({ extended: true })); // For parsing form data
app.use(express.static(path.join(__dirname, 'public'))); // Serving static files

// Home page
app.get('/', (req, res) => {
  res.render("index");
});

// Read all users and display
app.get('/read', async (req, res) => {
  let users = await userModel.find();
  res.render("read", { users }); // Passing users to read.ejs
});

// Create a new user
app.post('/create', async (req, res) => {
  const { name, email, image } = req.body;

  await userModel.create({ name, email, image });
  console.log("✅ User created successfully with email:", email);

  res.redirect("/read");
});

// Show edit form for a specific user
app.get('/edit/:userid', async (req, res) => {
  let user = await userModel.findOne({ _id: req.params.userid });
  res.render("edit", { user }); // Passing the user to edit.ejs
});

// Update user with new data
app.post('/update/:userid', async (req, res) => {
  let { image, name, email } = req.body;

  // Trim the ID just in case to avoid CastError
  let user = await userModel.findOneAndUpdate(
    { _id: req.params.userid.trim() },
    { image, name, email },
    { new: true }
  );

  res.redirect("/read");
});

// Delete a user
app.get("/delete/:id", async (req, res) => {
  await userModel.findOneAndDelete({ _id: req.params.id.trim() });
  res.redirect("/read");
});

// Start the server
app.listen(port, () => {
  console.log("🚀 Server is running on http://localhost:" + port);
});
