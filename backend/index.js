import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './utils/db.js'
import authRouter from './routes/auth.route.js'
import staticRoleRouter from './routes/staticRoles.route.js'
import userRouter from './routes/user.route.js'
import personalisedRoleRouter from './routes/personalisedRoles.route.js'
import cors from 'cors'

dotenv.config()
connectDB()

const app = express()
const PORT = process.env.PORT || 8000

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', process.env.FRONTEND_URI], // whitelist local + deployed frontend
    credentials: true // if you're using cookies or auth headers
}));

app.use(express.json())
app.use(express.urlencoded({
    extended: true,
    parameterLimit: 5000
}))

app.get('/', (req, res) => {
    res.send("SkillMapper HomePage")
})

app.use('/api/auth', authRouter)
app.use('/api/staticRoles', staticRoleRouter);
app.use('/api/user', userRouter)
app.use('/api/personalisedRole', personalisedRoleRouter)

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`App running on PORT ${PORT}`)
    })
}

export default app;