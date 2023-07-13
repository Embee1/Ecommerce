const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const validateMongodbid = require('../utils/validateMongodbid');


//create Blog
const createBlog = asyncHandler(async(req, res) =>{

    try{
        const newBlog = await Blog.create(req.body);
        res.json(newBlog)
 }
    catch(error){
        throw new Error(error)
    }
});

//update functionality.
const updateBlog = asyncHandler(async(req, res) =>{

    const {id} = req.params;
    validateMongodbid(id);
    try{
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updateBlog)

    }
    catch(error){
        throw new Error(error)
    }
});


//get a blog
const getBlog = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    validateMongodbid(id);
    try{
        const getBlog = await Blog.findById(id).populate('likes').populate('dislikes');
await Blog.findByIdAndUpdate(id, {
    $inc: {numViews:1},
},
    {new:true}
    );

        res.json(getBlog)
}
    catch(error){
        throw new Error(error)
    }
});


//get all blogs
const getAllBlogs = asyncHandler(async(req, res) => {
    // const getAllBlogs = await Blog.save

    try{
        const getBlogs = await Blog.find();
        res.json(getBlogs)

    }catch(error){
        throw new Error(error)
    }
});

//delete blog by id.
const deleteBlog = asyncHandler(async(req, res) =>{

    const {id} = req.params;
    validateMongodbid(id);
    try{
        const deleteBlog = await Blog.findByIdAndDelete(id);
        res.json(deleteBlog)

    }
    catch(error){
        throw new Error(error)
    }
});


//like functionality
const likeBlog = asyncHandler(async(req, res)=>{
    const {blogId} = req.body;
    validateMongodbid(blogId);

    //find the blog which you want to be liked.

    const blog = await Blog.findById(blogId);

    //find the login user
    const loginUserId = req?.user?._id;

    //find if the user has liked the blog.
    const isliked = blog?.isliked;

    // find if the user dislikes the blog
    const alreadyDisliked = blog?.dislikes?.find((userId)=>userId?.toString()===loginUserId?.toString());
    
    if(alreadyDisliked){
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {dislikes: loginUserId},
            isDisliked: false
        }, {
            new: true
        });
        res.json(blog);
    }
    if(isliked){
    const blog = await Blog.findByIdAndUpdate(
        blogId, 
        {
            $pull: {likes: loginUserId},
            isliked: false
        }, 
        {
            new: true
        }
        );
        res.json(blog);

    }else{
        const blog = await Blog.findByIdAndUpdate(
            blogId, 
            {
                $push: {likes: loginUserId},
                isliked: true,
            }, 
            {
                new: true
            }
            );
            res.json(blog);
    }
});

//dislike functionality.
const dislikeBlog = asyncHandler(async(req, res)=>{
    const {blogId} = req.body;
    validateMongodbid(blogId);

    //find the blog which you want to be liked.

    const blog = await Blog.findById(blogId);

    //find the login user.
    const loginUserId = req?.user?._id;

    //find if the user has liked the blog.
    const isDisliked = blog?.isDisliked;

    // find if the user dislikes the blog.
    const alreadyLiked = blog?.likes?.find((userId)=>userId?.toString()===loginUserId?.toString());
    
    if(alreadyLiked){
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {likes: loginUserId},
            isliked: false
        }, {
            new: true
        });
        res.json(blog);
    }
    if(isDisliked){
    const blog = await Blog.findByIdAndUpdate(
        blogId, 
        {
            $pull: {dislikes: loginUserId},
            isDisliked: false
        }, 
        {
            new: true
        }
        );
        res.json(blog);

    }else{
        const blog = await Blog.findByIdAndUpdate(
            blogId, 
            {
                $push: {Dislikes: loginUserId},
                isDisliked: true,
            }, 
            {
                new: true
            }
            );
            res.json(blog);
    }
});

module.exports = {createBlog, updateBlog, getBlog,  getAllBlogs,  deleteBlog, likeBlog, dislikeBlog};