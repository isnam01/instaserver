const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const login=require('../middleware/requirelogin');
const Post=mongoose.model('Post');

router.get('/allpost',login,(req,res)=>{
    Post.find()
    .populate('postedby',"_id name")
    .populate('comments.postedby',"_id name")
    .then((posts)=>{
        res.json({posts})
    })
    .catch((err)=>{
        console.log(err)
    })
})

router.post('/createpost',login,(req,res)=>{
    const {title,body,pic}=req.body
    console.log(req)
    if(!title || !body)
    {
        res.status(422).json({"error":"Please add all fields"})
    }
    const post= new Post({
        title,
        body,
        picture:pic,
        postedby:req.user._id
    })
    post.save()
    .then((result)=>{
        res.json({posts:result})
    })
    .catch((err)=>{
        console.log(err)
    })
})

router.get('/mypost',login,(req,res)=>{
    Post.find({postedby:req.user._id})
    .populate("comments.postedby","_id name")
    .populate('postedby',"_id name")
    .then((posts)=>{
        res.json(posts)
    })
    .catch((err)=>{
        console.log(err)
    })
})


router.put('/like',login,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    
    })
    .populate("comments.postedby","_id name")
    .populate('postedby',"_id name")
    .exec((err,result)=>{
        if(err)
        {
            res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})
router.put('/unlike',login,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("comments.postedby","_id name")
    .populate('postedby',"_id name")
    .exec((err,result)=>{
        if(err)
        {
            res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put('/comments',login,(req,res)=>{
    console.log(req.body)
    const comment={
        text:req.body.text,
        postedby:req.user
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedby","_id name")
    .populate('postedby',"_id name")
    .exec((err,result)=>{
    if(err)
    {
        res.status(422).json({error:err})
    }
    else{
        res.json(result)
    }
    })
})

router.delete('/comments',login,(req,res)=>{
    
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{comments:{_id:req.body.commId}}
    },{
        new:true
    })
    .populate("comments.postedby","_id name")
    .populate('postedby',"_id name")
    .exec((err,result)=>{
    if(err)
    {
        res.status(422).json({error:err})
    }
    else{
        res.json(result)
    }
    })
})

router.delete('/myposts',login,(req,res)=>{
    console.log(req.body)
    Post.findOne(req.body.postId)
    .populate('postedby',"_id name")
    .exec((err,post)=>{
    if(err || !post)
    {
        return res.status(422).json({error:err})
    }

        post.remove()
        .then((result)=>{
            console.log(result)
            res.json(result)
        })
        .catch((err)=>{
            console.log(err)
        })
    
    })
})

router.get('/posts',login,(req,res)=>{
    Post.find({postedby:{$in:req.user.following}})
    .populate('postedby',"_id name")
    .populate('comments.postedby',"_id name")
    .then((posts)=>{
        res.json({posts})
    })
    .catch((err)=>{
        console.log(err)
    })
})

module.exports=router;