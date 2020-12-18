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
    resetToken:{
        type:String
    },
    expireToken:{
        type:Date
    },
    following:[{
        type:ObjectId,
        ref:'User'
    }],
    picture:{
        type:String,
    },
});

mongoose.model("User",UserSchema);