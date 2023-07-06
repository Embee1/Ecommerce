const express = require('express');
 const { createUser, loginUserCtrl, getallUser, getOneUser, deleteOneUser,  updateAUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword } = require('../controller/userCtrl');
 const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');
 const router = express.Router();
 handleRefreshToken


 router.post('/register',  createUser);
 router.post('/forgot-password-token',  forgotPasswordToken);
 router.put('/reset-password/:token',  resetPassword);
 router.post('/login', loginUserCtrl);
 router.get('/all-users', getallUser);
 router.get('/refresh', handleRefreshToken);
 router.get('/logout', logout);
 router.get('/:id', authMiddleware,  isAdmin, getOneUser);
 router.delete('/:id', deleteOneUser);
 router.put('/edit-user',authMiddleware, updateAUser);
 router.put('/password', authMiddleware, updatePassword);
 router.put('/block-user/:id', authMiddleware, isAdmin,  blockUser);
router.put('/unblock-user/:id',authMiddleware, isAdmin, unblockUser);


module.exports = router; 




