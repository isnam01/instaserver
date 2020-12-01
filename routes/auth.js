const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const User=mongoose.model("User");
const bcrypt=require("bcryptjs");
const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require('../config/keys')
const login=require('../middleware/requirelogin')

router.get('/',(req,res)=>{
    res.send("hello");
});

router.post('/signup',(req,res)=>{
    const {name,email,password,pic}=req.body
    console.log(req.body)
    if(!email || !password || !name)
    {
        return res.status(422).json({error:"Add all data"})
    }
   User.findOne({email:email})
   .then((savedUser)=>{
       if(savedUser){
            return res.status(422).json({error:"User already exists with that email"})
       }
       bcrypt.hash(password,15)
       .then((hashedpw)=>{
            const user=new User({
                email,
                password:hashedpw,
                name,
                picture:pic
            })
            user.save()
            .then((user)=>{
                res.json({message:"Saved Successfully"})
            })
            .catch((err)=>{
                console.log(err)
            })
        })
   })
   .catch((err)=>{
        console.log(err)
    })
});

router.post('/signin',(req,res)=>{
    const {email,password}=req.body
    if(!email || !password)
    {
        return res.status(422).json({error:"Please provide email or password"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email or password"})
       }
       bcrypt.compare(password,savedUser.password)
       .then(match=>{
           if(match)
           {
                const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name,email,followers,following,picture} =savedUser
                res.json({token,user:{_id,name,email,followers,following,picture}})
           }
           else{
                return res.status(422).json({error:"Invalid email or passowrd"})
           }
       })
       .catch((err)=>{
           console.log(err)
       })
    })
})

module.exports=router;