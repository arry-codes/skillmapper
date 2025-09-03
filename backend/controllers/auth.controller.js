import bcrypt from 'bcryptjs'
import { User } from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'

export const registerUser = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }

    const { email, password, username } = req.body;

    if (!email || !password || !username) {
        return res.status(400).send("Bad request Fill the details properly")
    }

    const salt = await bcrypt.genSalt(10);
    const securedPassword = await bcrypt.hash(password, salt)

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        const createUser = new User({
            username,
            email,
            password: securedPassword
        })

        await createUser.save()

        const payload = {
            user: {
                id: createUser._id
            }
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY)

        console.log("User Created Successfully")
        return res.status(201).send({ message: "User Sucessfully Registered", authToken: token })

    }
    catch (error) {
        console.log("Error in Registration Route", error.message)
        res.status(500).send("Internal Server Error")
    }

}

export const loginUser = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).send("Enter valid credentials")
        }

        const user = await User.findOne({ username: username })

        if (!user) {
            return res.status(400).send("User does not exists")
        }

        const hashedCode = await bcrypt.compare(password, user.password)

        if (!hashedCode) {
            return res.status(400).send("Enter valid credentials")
        }

        const payload = {
            user: {
                id: user._id
            }
        }

        const authToken = jwt.sign(payload, process.env.JWT_SECRET_KEY)

        console.log("User logged in Successfully")
        return res.status(200).json({
            message: "User Logged in Successfully",
            authToken: authToken
        })
    }
    catch (error) {
        console.log("Error in Registration Route", error.message)
        res.status(500).send("Internal Server Error")
    }

}

export const fetchUserDetails = async(req,res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password')
        res.json(user)
    } 
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error")
    }
}