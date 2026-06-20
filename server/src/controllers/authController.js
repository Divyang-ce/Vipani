const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const registerUser = async (req, res) => {
    const {name, email, password} = req.body;
    
    if(!name || !email || !password){
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields"
        })
    }

    const existingUser = await User.findOne({ email });
    if(existingUser){
        return res.status(400).json({
            message: "user already exists"
        });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("original password:",password);
    // console.log("hashed password:",hashedPassword);

    const user = await User.create({
        name,
        email,
        password:hashedPassword,
    })
    res.status(200).json({
        
        message: "user registered successfully",
        user
    });
}

const loginUser = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({
            message:"email and password are required"
        })
    }

    const user = await User.findOne({ email });

    //user na mae to
    if(!user){
        return res.status(400).json({
            message: "Invalid credentials",
        })
    }
    // password match karva mate
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(400).json({
            message: "Invalid credentials",
        })
    }

    const token = jwt.sign({
        userId: user._id,
        role: user.role,
    },
    process.env.JWT_SECRET,{
        expiresIn: "7d",
    }
)

    return res.status(200).json({
        message: "Login successful",
        token
    })
}

const getMe = async(req,res) => {
    res.json({
        message: "protected roouting working",
        user: req.user,
    })
}
module.exports = {registerUser, loginUser , getMe};

