const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const db=require('../config/connectdb');
const user = require('../models/user');
const transporter=require('../config/emailConfig')
JWT_SECRET_KEY='dgfsygfhb82138129hsdfhsjkhfs';

userRegistration= async (req,res)=>{
    const{name,email,password,password_confirmation,tc}=req.body;

   await db.user.findOne({
        where: {
            email:email
        }
    }).then(async(data)=>{
        if(data){
            res.status(201).send({"status":"failed","message":'Email already exists.'})
        }
        else{ 
            if(name && password && email && password_confirmation && tc){
                if(password ===password_confirmation){
                    try{
                    const salt= await bcrypt.genSalt(10)
                    const hashPassword=await bcrypt.hash(password,salt)
                    console.log(hashPassword)
                    db.user.create({
                        name:name,
                        email:email,
                        password:hashPassword,
                        tc:tc
                    }).then(data=>{
                        //jwt token generation
                        const token=jwt.sign({userID:data.id},JWT_SECRET_KEY,{expiresIn:'5d'})
                        res.json({
                            status: 200,
                            data: data.id,
                            token:token
                        })
                    })

                    }catch(err){
                        console.log(err)
                    }
                }else{
                    res.send({"status":"failed","message":'password and confirm password doesn\'t match'})
                }

            }else{
                res.send({"status":"failed","message":'All fields are required.'})
            }
        }
    })
}


userLogin=async(req,res)=>{
    try{
    const {email,password}=req.body;
    if(email && password){
        const salt= await bcrypt.genSalt(10)
      
        db.user.findOne({
            where:{
                email:email         
            }
        }).then(async data=>{
            console.log(data)
            if(data != null){
                const isMatch=await bcrypt.compare(password,data.password)
                if(data.email === email && isMatch){
                     //jwt token generation
                     const token=jwt.sign({userID:data.id},JWT_SECRET_KEY,{expiresIn:'5d'})
                    res.json({
                        status:200,
                        data:" Successful login",
                        token:token
                    })
                }else{
                    res.json({
                        status:200,
                        data:" incorrect email or password."
                    })
                }
               
            }else{
                res.json({
                    status:201,
                    data:"Incorrect email and password."
                })
            }
            
            })
        .catch(err=>{
            console.log(err)
            res.json({
                status:200,
                data:'unable to login'
            })
        })
            
        
    }else{
        res.send({"status":"failed","message":'All fields are required.'})
    }
    }catch(err){
        console.log(err)
    }
    
}

changeUserPassword=async(req,res)=>{
    const {password,password_confirmation} = req.body;
    if(password && password_confirmation){
        if(password !== password_confirmation){
            res.send({"status":"failed","message":'New password and confirmation password doesn\'t match'})
        }else{
            const salt= await bcrypt.genSalt(10)
            const newhashPassword= await bcrypt.hash(password,salt)
            
            db.user.findOne({
                where:{
                    id:req.user.id
                }
            }).then(data=>{
                data.update({
                    password:newhashPassword
                }).then(update=>{
                    if(update){
                        res.send({"status":"success","message":'Password change successfully'})
                    }
                }).catch(error=>{console.log(error)})
            }).catch(error=>{console.log(error)})
           
        }
    }
    else{
        res.send({"status":"failed","message":'All fields are required.'})
    }
}

loggedUser=async(req,res)=>{
   timeout=setTimeout(()=>{
    console.log('Inside setTimeout 10',req.user)
    res.json({'user':req.user})
   },10) 
//    res.json({'user':req.user})
}

sendUserPasswordResetEmail= async(req,res)=>{
    console.log('email',req.body)
    const {email}=req.body;
    if(email){
        db.user.findOne({
            where:{
                email:email
            }
        }).then(async data=>{
            if(data){
                const secret=data.id + JWT_SECRET_KEY;
                const token=jwt.sign({userID:data.id},secret,{expiresIn:'15m'})
                //client side link
                const link=`http://127.0.0.1:3000/api/user/reset/${data.id}/${token}`
                console.log(link)

                //sending email
                try{
                    let info= await transporter.sendMail({
                        from:'mamtavish2603@gmail.com',
                        to:data.email,
                        subject:"Test- Password reset link",
                        html:`<a href=${link}>click here</a> to reset your password`
                    })
                    res.send({'status':'success','message':'password reset email sent...Please check your email.',"info":info})
                }catch(err){
                    console.log(err.message)
                }
            }else{
                res.send({'status':'faild','message':'Email doesn\'t exists.'})
            }
        })
    }else{
        res.send({'status':'faild','message':'Email is required.'})
    }
}

userPasswordReset=async(req,res)=>{
    const {password,password_confirmation}=req.body;
    const {id,token}=req.params;
    db.user.findOne({
        where:{
            id:id
        }
    }).then(async data=>{
        const new_secret= data.id + JWT_SECRET_KEY;
        try{
            if(password && password_confirmation){
                if(password === password_confirmation){
                    const salt= await bcrypt.genSalt(10)
                    const newhashPassword= await bcrypt.hash(password,salt)
                    data.update({
                        password:newhashPassword
                    }).then(updated=>{
                        res.send({'status':'faild','message':'Password reset successfully.'})
                    })
                }else{
                    res.send({'status':'faild','message':'Password and confirm password doesn\'t match.'})
                }
            }else{
                res.send({'status':'faild','message':'All Fields are required.'})
            }

        }catch(error){
            console.log(error)
            res.send({'status':'faild','message':'Invalid Token'})
        }
    }).catch(error=>{
        console.log(error)
    })
}
module.exports={
    userRegistration:userRegistration,
    userLogin:userLogin,
    changeUserPassword,
    loggedUser,
    sendUserPasswordResetEmail,
    userPasswordReset
}