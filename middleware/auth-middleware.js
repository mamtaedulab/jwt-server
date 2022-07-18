const jwt=require('jsonwebtoken')
const db=require('../config/connectdb')

JWT_SECRET_KEY='dgfsygfhb82138129hsdfhsjkhfs';

module.exports=checkUserAuth=async(req,res,next)=>{
    let token;
    const {authorization}= req.headers
   
    if(authorization && authorization.startsWith('Bearer')){
        try{
            console.log(authorization.startsWith('Bearer'))
            //get token from header
            token=authorization.split(' ')[1]
            //verify token
            const {userID}=jwt.verify(token,JWT_SECRET_KEY)
            console.log(userID)
            //get user from token
           db.user.findOne({
                where:{
                    id:userID
                }
            }).then(data=>{
                req.user=data
                console.log('firstUSER',req.user)
            }).catch(err=>{console.log(err)})
            
            next()
        }catch(error){
            res.send({'status':'failed',"message":"unauthorized user"})
        }
    }
    if(!token){
        res.status(401).send({'status':'failed',"message":"unauthorized user , NO Token"})
    }
}