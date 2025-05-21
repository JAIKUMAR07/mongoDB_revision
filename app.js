// Import required modules
const express = require('express');              // Express is used to create the server and handle routes
const cookieParser = require('cookie-parser');   // Middleware to parse cookies from the client
const bcrypt = require('bcrypt');                // (Not used here but generally for password hashing)
const jwt = require("jsonwebtoken");             // Used to create and verify secure tokens (JWTs)

const app = express();

// Apply cookie-parser middleware globally
// This allows us to read cookies from incoming HTTP requests
app.use(cookieParser());


// Route: GET "/"
// This route will create a JWT token and set it in a cookie
app.get("/", function(req, res) {
   // Create a JWT token using jwt.sign()
   // It contains payload data: { email: "rahul@gmail.com" }
   // The second argument is a secret key used to sign the token
   let token = jwt.sign({ email: "rahul@gmail.com" }, "secret");

   // Set the token as a cookie in the browser with the key 'token'
   // The client will automatically send this cookie in future requests
   res.cookie("token", token);

   // Log the token in the server console for reference
   console.log("ye rha token: ", token);

   // Send a response to the client to confirm the token was set
   res.send("done ho gya ");
});


// Route: GET "/read"
// This route reads the JWT token from cookies and verifies it
app.get("/read", function(req, res) {
  // Log the received cookie value (token) from the browser
  console.log("mor cookie ", req.cookies.token);

  // Verify the JWT token using the same secret key used during signing
  // If the token is valid, it returns the payload data (e.g., { email: "rahul@gmail.com", iat: ... })
  let data = jwt.verify(req.cookies.token, "secret");

  // Log the decoded token data (payload)
  console.log("data ", data);

  // Respond back to client (optional but good to confirm)
  res.send("Token verified. Welcome " + data.email);
});


// Start the Express server on port 3000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
