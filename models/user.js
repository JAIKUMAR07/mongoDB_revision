const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/testingTheDataBase') 

const userSchema = new mongoose.Schema({
    
    username: String,
    email : String, 
    password : String ,
    age: Number,
     // jo bhi post krega uska post nhi id store hoga isliye ek psot name ka module bnaye 
     posts: [
        {
            type: mongoose.Schema.Types.ObjectId, // means iska type ids hai 
             ref:"post" 
        }
     ]
}) 

module.exports = mongoose.model('user', userSchema)