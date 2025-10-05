const jwt = require('jsonwebtoken');


const authMiddlware = (req,res,next)=>{
    const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET;
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({ message: 'Authentication required' });
    }
    try{
        const payload = jwt.verify(token,JWT_TOKEN_SECRET);
        req.user = {id:payload.id,role:payload.role};
        next();
    }catch(err){
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports= authMiddlware;