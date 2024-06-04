import User from "../models/User.js";
import bcrypt from 'bcrypt';

export const getAllUser = async(req,res,next)=>{
    let users;
    try {
        users = await User.find();
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
    if (!users) {
        return res.status(404).json({ message: "No Users Found" });
    }
    return res.status(200).json({ users });
};

export const signup = async(req,res,next)=>{
    const {name,email,password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
    if (existingUser) {
        return res.status(400).json({ message: "User Already Exists! Login Instead" });
    }
    
    // Generate a salt
    const saltRounds = 10;
    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    
    const user = new User({
        name,
        email,
        password: hashedPassword,
        blogs:[]
    });

    try {
       await user.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(201).json({ user });
}

export const login = async (req,res,next)=>{
    const {email,password} = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
    if (!existingUser) {
        return res.status(404).json({ message: "User Does not Exists! Signup Instead" });
    }

    const isPasswordCorrect = bcrypt.compareSync(password,existingUser.password);
    if(!isPasswordCorrect){
        return res.status(400).json({ message: "Invalid Password!" });
    }
    return res.status(200).json({ message: "Login Successfull!" });
}