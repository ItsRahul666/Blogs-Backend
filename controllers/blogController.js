import mongoose from "mongoose";
import Blog from "../models/Blog.js";
import User from "../models/User.js";

export const getAllBlogs = async(req,res,next)=>{
    let blogs;
    try {
        blogs = await Blog.find();
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
    if (!blogs) {
        return res.status(404).json({ message: "No Blogs Found" });
    }
    return res.status(200).json({ blogs });
};

export const addBlog = async(req,res,next)=>{
    const {title,description,image,user} = req.body;
    let existingUser;
    try{
        existingUser = await User.findById(user)
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
    if (!existingUser){
        return res.status(400).json({message:"Unable To Find The User By This Id"})
    }
    const blog = new Blog({
        title,
        description,
        image,
        user,
    });
    try {
        await blog.save();
        existingUser.blogs.push(blog);
        await existingUser.save();
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: err });
    }
    return res.status(200).json({ blog });
};


export const updateBlog = async(req,res,next)=>{
    const {title,description} = req.body;
    const blogId = req.params.id;
    let blog;
    try {
        blog = await Blog.findByIdAndUpdate(blogId, {
            title,
            description,
        });
    }  
    catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
    if(!blog){
        return res.status(500).json({ message: "Unable To Update The Blog" });
    }
    return res.status(200).json({blog});
};

export const getById = async(req,res,next)=>{
    const id = req.params.id;
    let blog;
    try{
        blog = await Blog.findById(id);
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
    if(!blog){
        return res.status(404).json({ message: "No Blog Found" });
    }
    return res.status(200).json({blog});
};

export const deleteBlog = async (req, res, next) => {
    const id = req.params.id;
    let blog;
    try {
        blog = await Blog.findByIdAndDelete(id).populate('user');
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
    if (!blog) {
        return res.status(404).json({ message: "Unable To Delete Blog" });
    }
    return res.status(200).json({ message: "Blog Deleted Successfully!" });
};

export const getByUserId = async (req,res,next)=>{
    const userId = req.params.id;
    let userBlogs;
    try{
        userBlogs = await User.findById(userId).populate("blogs");
    }
    catch(err){
        return res.status(500).json({ message: err });
    }
    if(!userBlogs){
        return res.status(404).json({ message: "No Blogs Found" });
    }
    return res.status(200).json({blogs: userBlogs });
};
