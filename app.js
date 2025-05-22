const express = require('express');
const app = express();
const userModel = require("./models/user");
const postModel = require("./models/post");

app.get("/", (req, res) => {
    res.send("hello ees world");
});

app.get("/create", async (req, res) => {
    let user = await userModel.create({
        username: "rahul",
        email: "rahul@gmail.com",
        password: "123", // In real apps, hash this!
        age: 2 // assuming age is a number in the schema
    });

    res.send(user);
});

app.get("/post/create", async  (req, res) => {
     let post = await  postModel.create({
        postdata: "hello world",
        user: "682ee1ed14de682eaec66b97" // assuming this is a valid ObjectId

    })
 let user = await userModel.findOne({ _id: "682ee1ed14de682eaec66b97"})

 user.posts.push(post._id) ;
 await user.save(); // khud se save krna padega

     
    res.send({
      post ,user
    });
});

app.listen(3000, () => {
    console.log("server is running on port 3000");
});
