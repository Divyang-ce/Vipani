const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // badha email lowercase ma store karva mate
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    role: {
        type: String,
        enum: ["user", "admin"],// user ne admin banava mate enum use kariye che
        default: "user"
    },

    resetPasswordToken: {
        type: String,
        default: null
    },
 
    resetPasswordExpire: {
        type: Date,
        default: null
    },
   
},
    // Automatically add createdAt and updatedAt fields to the schema
    { timestamps: true }
)

module.exports = mongoose.model("User", userSchema);