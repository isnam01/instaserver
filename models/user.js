const { ObjectId } = require('mongodb');
const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    followers:[{
        type:ObjectId,
        ref:'User'
    }],
    following:[{
        type:ObjectId,
        ref:'User'
    }],
    picture:{
        type:String,
        default:"https://res.cloudinary.com/mansi-gupta/image/upload/v1606155684/xurci9eu8f9og158twod.jpg"
    },
});

mongoose.model("User",UserSchema);