import express from 'express';
import { upload } from '../configs/multer.js';
import { addPost, getFeedPosts, likePost, addComment, getComments, getUserLikedPosts } from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';

const postRouter =express.Router();

postRouter.post('/add',upload.array('images',4),protect,addPost);
postRouter.get('/feed',protect,getFeedPosts);
postRouter.post('/like',protect,likePost);
postRouter.post('/comment/add',protect,addComment);
postRouter.get('/comment/:postId',getComments);
postRouter.get('/liked/:userId',getUserLikedPosts);

export default postRouter;