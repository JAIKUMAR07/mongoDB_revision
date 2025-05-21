const cookieParser = require('cookie-parser');
const express = require('express');

const app = express();
app.use(cookieParser()); // good!

// Set the cookie
app.get('/', (req, res) => {
  res.cookie('name', 'John Doe');
  res.send('Cookie has been set');
});

// Read the cookie
app.get('/read', (req, res) => {
  console.log(req.cookies); // Logs all cookies
  res.send('Cookie read: ' + req.cookies.name); // only one res.send
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
