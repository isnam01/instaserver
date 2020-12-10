const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema.Types;

const PostSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    likes:[{type:ObjectId,ref:'User'}],
    comments:[{text:String,postedby:{type:ObjectId,ref:"User"}}],
    picture:{
        type:String,
    },
    postedby:{
        type:ObjectId,
        required:true,
        ref:'User'
    }
},{timestamp:true});

mongoose.model("Post",PostSchema);