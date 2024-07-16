const express = require('express')
const app = express()
require('dotenv').config()
const db = require('./config/dbConnection')
const PORT = process.env.PORT || 5000
const authRouter = require('./routes/userAuthRoute')
const path = require('path')


// middleware
app.use(express.json())
// Middleware for serving static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// routes
app.use('/auth' , authRouter)
app.get('/' , (req,res)=>{
    res.send("hello")

})

app.listen(PORT , ()=>console.log(`Server Running at http://localhost:${PORT} `))