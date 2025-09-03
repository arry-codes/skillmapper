import jwt from 'jsonwebtoken'

export const fetchUser = async(req,res,next)=>{
    const token = req.header('authToken')
    if(!token){
        return res.status(401).send({message:"Pls authenticate first"});
    }
    try {
        const data = jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.user = data.user;
        next()
    } 
    catch (error) {
        res.status(401).send({message:"Pls authenticate with valid credentials"})
        console.log(error.message)
    }
}