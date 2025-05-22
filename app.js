const express = require('express');
const app = express();
const userModel = require("./models/user")
const port = 3000;
const cookieParser = require('cookie-parser')
const path = require('path');
const bcrypt = require('bcrypt'); 
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true }))
 app.use(express.static(path.join(__dirname , "public"))); 
 app.use(cookieParser());

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/create',  (req, res) => {


let {username , email , password , age } = req.body ; 

bcrypt.genSalt(10 , (err ,salt)=>{
  
  bcrypt.hash(password , salt , async(err, hash)=>{
        console.log(hash)
        // store hash in your password DB.
        let createdUser = await userModel.create({
          username , 
          email,
           password : hash,
            age
         })
            res.send(createdUser);
    
   })
})

          
  
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})