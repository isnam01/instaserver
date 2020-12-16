const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const User=mongoose.model("User");
const bcrypt=require("bcryptjs");
const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require('../config/keys')
const login=require('../middleware/requirelogin')
const nodemailer=require("nodemailer");
const {SEND_API}=require('../config/keys')
const crypto=require('crypto')

let mailTransporter = nodemailer.createTransport({ 
    service: 'gmail', 
    auth: { 
        user: 'mansiqwerty01@gmail.com', 
        pass: SEND_API
    } 
});


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
                console.log(user.email)
                let mailDetails = { 
                    from: 'mansiqwerty01@gmail.com', 
                    to: user.email, 
                    subject: 'Signup Successful', 
                    text: 'I hope you have wonderful experience on this platform',
                    html:"<h1>Congratulations on signup<h1>"
                };
                mailTransporter.sendMail(mailDetails, function(err, data) { 
                    if(err) { 
                        console.log('Error Occurs'); 
                    } else { 
                        console.log('Email sent successfully'); 
                    } 
                }); 
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

router.post('/resetpassword',login,(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err)
        {
            console.log(err)
        }
        else
        {
            const token=buffer.toString("hex")
            User.findOne({email:req.body.email})
            .then((user)=>{
                if(!user)
                {
                    return res.status(422).json({error:"User doesnot exist"})
                }
                user.resetToken=token
                user.expireToken=Date.now() + 3600000
                user.save()
                .then((result)=>
                {
                    let mailDetails = { 
                        from: 'mansiqwerty01@gmail.com', 
                        to: user.email, 
                        subject: 'Reset Password', 
                        text: 'Here is the link to reset your password',
                        html:`<h1>Click on this link <a href="https://qwertians.netlify.app/reset/${token}">link</a><h1>`
                    }
                    mailTransporter.sendMail(mailDetails, function(err, data) 
                    { 
                        if(err) { 
                            console.log('Error Occurs'); 
                        } else { 
                            console.log('Email sent successfully'); 
                        } 
                    })
                })
                res.json({message:"Reset passsword link has beensent to your mail"})
            })
        }
    })
})

module.exports=router;