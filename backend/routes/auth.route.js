import express from 'express'
import { body} from 'express-validator'
import { fetchUserDetails, loginUser, registerUser } from '../controllers/auth.controller.js'
import { fetchUser } from '../middlewares/fetchUser.middleware.js'

const router = express.Router()

// User Registration Route (Login Not Required)

router.post('/register', [
    body('email','Give a valid email address').trim().isEmail(),
    body('username','Minimum two letters').isLength({ min: 2 }),
    body('password','Minimum 5 letters').isLength({ min: 5 })
], registerUser)

// User Login Route (Login not requires)

router.post('/login',[
    body('username','Give a valid username').trim(),
    body('password','Enter min 5 digit password').isLength({min:5})
],loginUser)

router.post('/getuser',fetchUser,fetchUserDetails)

export default router