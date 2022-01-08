const express = require("express");
const userRoutes = new express.Router();
const auth = require("../middleware/auth");
const User = require("../model/User");


//get all users
userRoutes.get("/all",auth,async (req,res)=>{
    try{
      const users = await User.find({});
      res.send({users});
    }catch(error){
          
           res.status(400).send(error);
    }
})

//user register
userRoutes.post("/register", async (req, res) => {
    try {
        console.log(req.body)
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
          return res.status(400).send({ error: "Email already in use !" });
        }
        const user = await new User(req.body).save();
        const token = await user.generateToken();
        res.status(201).send({ user, token });
    }catch(error){
        console.log("Err",error)
        res.status(400).send(error);
    }
})

//user login
userRoutes.post("/login", async (req,res)=>{
   try{
    const { email, password } = req.body;
    const user = await User.findUserByCredientials(email, password);
    const token = await user.generateToken();
    res.send({ user, token });
   }catch(error){
       console.log(error)
    res.status(400).send(error); 
   }
});

//user logout
userRoutes.get("/logout", auth, async (req, res) => {
    try {
      const index = req.user.tokens.indexOf(req.token);
      req.user.tokens.splice(index, 1);
      await req.user.save();
      res.send("logout sucessfully");
    } catch (error) {
      console.log("error", error);
      res.status(400).send({ error });
    }
  });

//update user data
userRoutes.put("/update",auth,async (req,res)=>{
   try{ 
      const {id,name,email,password,phone} = req.body;
     const updatedUser = await User.findByIdAndUpdate(id,{
       name,
       email,
       password,
       phone
     },
     {
            new: true,
          }
     );
     res.send({updatedUser});
   }catch(error){
     console.log("Errr",error)
      res.send({error});
   }
});

  module.exports = userRoutes;