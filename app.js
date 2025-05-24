// Import required modules
const express = require('express'); // Express.js web framework
const app = express(); // Create an instance of an Express app
 
const path = require("path"); // Node.js utility for working with file and directory paths
const multer = require("multer"); // Multer is middleware for handling file uploads
const crypto = require("crypto"); // Used to generate random bytes for secure filenames

// Set EJS as the templating/view engine
app.set("view engine", "ejs");

// Middleware to parse incoming form data (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory (like CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Configure multer's disk storage engine for handling file uploads
const storage = multer.diskStorage({
  // Define the destination folder for uploaded files
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads'); // Files will be stored here
  },
  // Define a secure, unique filename for each uploaded file
  filename: function (req, file, cb) {
    // Generate 16 random bytes to make a unique filename
    crypto.randomBytes(16, function(err, bytes) {
      if (err) return cb(err);
      // Combine random hex string with the original file extension (e.g., .jpg, .png)
      const fn = bytes.toString("hex") + path.extname(file.originalname);
      cb(null, fn);
    });
  }
});

// Create a multer instance with the defined storage settings
const upload = multer({ storage: storage });

// Define a simple GET route for the homepage
app.get("/", (req, res) => {
    res.send("hello ees world"); // Sends plain text response
});

// Render an EJS template for testing purposes (test.ejs file should exist in 'views' directory)
app.get("/test", async (req, res) => {
    res.render("test"); // Renders the 'test' view
});

// Handle POST request to upload a single image file from a form
// The field name expected in the form must be "image"
app.post("/upload", upload.single("image"), async (req, res) => {
    // Log the uploaded file info to the console (includes filename, path, etc.)
    console.log(req.file);
    // Send a success response to the client
    res.send("File uploaded successfully");
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log("server is running on port 3000");
});
