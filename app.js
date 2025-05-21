const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

const app = express();
app.use(cookieParser());

// Set the cookie and hash a password
app.get('/', (req, res) => {
  const merapassword = "rahul123";

  bcrypt.genSalt(10, function(err, salt) {
    console.log("ye rha salt: " + salt);

    bcrypt.hash(merapassword, salt, function(err, hash) {
      console.log("ye rha hash: " + hash);

      // Set a cookie with the hashed password
      res.cookie('pass', hash);
      res.send("Password hashed and cookie set!");
    });
  });
});

// Read the cookie
app.get('/read', (req, res) => {
  console.log(req.cookies); // Show all cookies
  res.send('Cookie read: ' + req.cookies.pass);
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
