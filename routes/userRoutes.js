const express=require('express');
const checkUserAuth=require('../middleware/auth-middleware')
const router=express.Router();
const {userRegistration,userLogin,changeUserPassword,loggedUser,sendUserPasswordResetEmail,userPasswordReset}=require('../controllers/userController')

//route level middleware-to protect route
router.use('/changepassword',checkUserAuth)
router.use('/loggeduser',checkUserAuth)


//public route
router.post('/register',userRegistration)
router.get('/login',userLogin)
router.post('/send-reset-password-email',sendUserPasswordResetEmail)
router.post('/reset-password/:id/:token',userPasswordReset)
// protected routes
router.post('/changepassword',changeUserPassword)
router.get('/loggeduser',loggedUser)
module.exports = router;