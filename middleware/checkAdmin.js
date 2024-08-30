const checkAdmin = (req,res,next)=>{
    const user = req.user
    try {
        // console.log(req.user)
        if(user.role === 'admin'){
            next()
        }else{
        res.status(401).json({status:401 , error : "Admin Not Found"})

        }
        
    } catch (error) {
        console.log(error)
        res.status(401).json({status:401 , error : error.message})

        
    }

}

module.exports = checkAdmin