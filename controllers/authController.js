const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async(req,res)=>{

    try{
    const {name,email,password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({success:false,message:"All fields are required"});
    }
    if (password.length < 6) {
        return res.status(400).json({success:false, message: "Password must be at least 6 characters long" });
    }
    
    const existingEmail = await User.findOne({email});
    if(existingEmail) return res.status(400).json({success:false,message:"Email already exists"});

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password,salt);
    const newUser  = new User({name,email,passwordHash});
    await newUser.save();
    res.status(201).json({success:true,message:"User registered successfully"});
    }catch(err){
        res.status(500).json({success:false,message:"Server error"});
    }

};

const loginUser = async(req,res) =>{
    try{
    const {email,password} = req.body;
    const user  = await User.findOne({email});
    if(!user) return res.status(400).json({success:false,message:"Invalid credentials"});

    const isMatch = await bcrypt.compare(password,user.passwordHash);
    if(!isMatch) return res.status(400).json({success:false,message:"Invalid credentials"});
    const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_TOKEN_SECRET,{expiresIn:'1d'});
    res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:'strict',
    });
    res.status(200).json({success:true,message:"Login successful" ,user: { id: user._id, name: user.name, email: user.email } });
    }catch(err){
        res.status(500).json({success:false,message:"Server error"});
    }
};

const getPrpfile = async(req,res) =>{
    try{
        const user = await User.findById(req.user.id).select('-passwordHash');
        res.status(200).json(user);
    }catch(err){
        res.status(500).json({success:false,message:"Server error"});
    }
};

module.exports = {
    registerUser,
    loginUser,
    getPrpfile
};


