import express from "express";
import { protect } from "../middleware/auth.js";
import { getUserData, UpdateUserData, discoverUsers, followUser, unfollowUser, sendConnectionRequest, acceptConnectionRequest, getUserConnections } from "../controllers/userController.js";
import { upload } from "../configs/multer.js";
import User from "../models/user.js";

const userRouter=express.Router();

// Test endpoint to create a user
userRouter.post('/test-create', async (req, res) => {
  try {
    const { userId, email, full_name, username } = req.body;
    const user = await User.create({
      _id: userId,
      email,
      full_name,
      username,
    });
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

userRouter.get('/data',protect,getUserData);
userRouter.post('/update',upload.fields([{name:'profile',maxCount:1},{name:'cover',maxCount:1}]),protect,UpdateUserData);
userRouter.post('/discover',protect,discoverUsers);
userRouter.post('/follow',protect,followUser);
userRouter.post('/unfollow',protect,unfollowUser);
userRouter.post('/connect',protect,sendConnectionRequest);
userRouter.post('/accept',protect,acceptConnectionRequest);
userRouter.post('/connections',protect,getUserConnections);

export default userRouter;