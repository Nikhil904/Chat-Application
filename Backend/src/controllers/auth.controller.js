import { GenerateToken } from "../lib/util.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js"
import user from "../models/user.model.js";

const saltRound = 10;
export const signup = async (req, res) => {
  const { email, full_name, password } = req.body;
  try {
    if (!email || !full_name || !password) {
      return res.status(400).json({ message: "All Fields Required" });
    }
    //check password length
    if (password?.length < 6) {
      return res
        .status(400)
        .json({ mesaage: "Password must be at least 6 characters" });
    }
    //check that user is exist or not
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ mesaage: "User already exists" });

    //hash Password
    let salt = await bcrypt.genSalt(saltRound);
    let HashedPassword = await bcrypt.hash(password, salt);

    //create a new user
    const newUser = new User({
      full_name,
      email,
      password: HashedPassword,
    });

    if (newUser) {
      //generate JWT Token
      GenerateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
      });
    } else {
      res.status(400).json({ message: "Invalid User Data" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong", err });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "User not found" });
    }

    let token = GenerateToken(user._id, res);
    console.log(token)
    let data = {
      _id: user._id,
      full_name: user.full_name,
      email: user.email,
    };

    res.status(200).json({ message: "Login Successfully", data: data });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong", err });
  }
};


export const updateProfile = async (req,res) => {
  try{
    const userId = req.user._id;
    const {profilePic} = req.body
    if(!profilePic){
        return res.status(404).json({ message: "Profile pic is required"})
    }
   const uploadResponse = await cloudinary.uploader.upload(profilePic)
   const updatedUser = await user.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
   res.status(200).json({ message: "User updated successfully",data:updatedUser})
  } catch(err){
    res.status(400).json({message:"Internal Server Error"})
  } 
}

export const checkAuth = (req,res) => {
  try{
    res.status(200).json({message:"User is Authenticated",data:req.user})
  }catch(err){
    res.status(500).json({message:"Internal Server Error"})
  }
}

export const logout = (req, res) => {
    try{
        res.cookie("jwt","",{MaxAge:0})
        res.status(200).json({ message:"Logout Successfully"})
    }catch(err){
        res.status(400).json({message:"Internal Server Error"})
    }
};

