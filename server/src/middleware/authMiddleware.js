const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    console.log(authHeader);

    if(!authHeader){
        return res.status(401).json({
            message: "No token provided, authorization denied"
        })
    }

    

    try{
        const token = authHeader.split(" ")[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Token:", token);
        console.log("Secret:", process.env.JWT_SECRET);
        
        req.user = decode;

        next();
    }

    catch(error){
        console.log("JWT Error:", error.message);
        
        return res.status(401).json({
            message: "Invalid Token",
        })
    }

    
}

module.exports = protect;