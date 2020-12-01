const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const login=require('../middleware/requirelogin');
const Post=mongoose.model('Post');
const User=mongoose.model('User');

router.get('/user/:id',login,(req,res)=>{
    console.log(req.body)
    User.findOne({_id:req.params.id})
    .select("-password")
    .then((user)=>{
        Post.find({postedby:req.params._id})
        .populate("postedby","_id name")
        .exec((err,posts)=>{
            if(err)
            {
                return res.status(422).json({error:err})
            }
            var exists=user.following.includes(req.user._id)
            return res.json({user,posts,exists})
        })
        }).catch((err)=>{
            return res.status(404).json({error:"User not found"})
        })
    })


router.put('/follow',login,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
            if(err)
            {
                return res.status(422).json({error:err})
            }
            User.findByIdAndUpdate(req.user._id,{
                $push:{following:req.body.followId}
            },{
                new:true
            }
            ).select("-password")
            .then(result=>{
                console.log(result)
                return res.json(result)
            }).catch(err=>{
                return res.status(404).json({error:err})
            })
        }
    )

})

router.put('/unfollow',login,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
            if(err)
            {
                return res.status(422).json({error:err})
            }
            User.findByIdAndUpdate(req.user._id,{
                $pull:{following:req.body.unfollowId}
            },{
                new:true
            }
            ).select("-password")
            .then(result=>{
                return res.json(result)
            }).catch(err=>{
                return res.status(404).json({error:err})
            })
        }
    )

})

router.put('/updatepic',login,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{picture:req.body.pic}},{new:true},
        (err,result)=>{
         if(err){
             return res.status(422).json({error:"pic canot post"})
         }
         res.json(result)
    })
})

module.exports=router;
