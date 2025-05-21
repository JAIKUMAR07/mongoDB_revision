const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

const app = express();
app.use(cookieParser());

// Set the cookie and hash a password
app.get('/', (req, res) => { // Load hash from your password DB.
  bcrypt.compare("rahul12", "$2b$10$.YjSYy11sxvj1EWef.1NjuxaL/dzHlVTuZu4B5/b5ctuPptH5QwGW", function(err, result) {
      // result == true 
      console.log("haa match kr rha " + result);
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
