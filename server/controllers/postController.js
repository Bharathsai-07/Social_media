import fs from 'fs';
import imagekit from '../configs/imageKit.js';
import Post from '../models/Post.js';
import User from '../models/user.js';
import Connection from '../models/Connection.js';

export const addPost=async(req,res)=>{
    try{
        const {userId}=req;
        const {content,post_type} = req.body;
        const images = req.files || [];

        let image_urls = [];

        if(images.length){
            image_urls=await Promise.all(
                images.map(async(image)=>{
                    const fileBuffer=fs.readFileSync(image.path);

                    const response=await imagekit.upload({
                                    file:fileBuffer,
                                    fileName:image.originalname,
                                    folder:"posts",
                                })
                    
                                const url=imagekit.url({
                                    path:response.filePath,
                                    transformation:[
                                        {quality:'auto'},
                                        {format:'webp'},
                                        {width:'1280'}
                                    ]
                                })
                                return url;
                })
            )
        }
        // determine post_type if not provided by client
        let finalPostType = post_type;
        if (!finalPostType) {
            if ((image_urls || []).length > 0) {
                finalPostType = content ? 'text_with_image' : 'image';
            } else {
                finalPostType = 'text';
            }
        }

        await Post.create({
            user: userId,
            content,
            image_urls,
            post_type: finalPostType
        })
        res.json({success:true, message:'Post created successfully'})
    }catch(error){
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

//get post 
export const getFeedPosts=async(req,res)=>{
    try{
        const {userId}=req;
        
        const user=await User.findById(userId);

        if(!user){
            // Fallback: return own posts even if user doc doesn't exist
            const ownPosts = await Post.find({user: userId}).populate('user').sort({createdAt:-1});
            return res.json({success:true, posts: ownPosts});
        }

        // Get accepted connections (bidirectional)
        const acceptedConnections = await Connection.find({
            $or: [
                { from_user_id: userId, status: 'accepted' },
                { to_user_id: userId, status: 'accepted' }
            ]
        });

        const connectedUserIds = acceptedConnections.map(conn => 
            conn.from_user_id === userId ? conn.to_user_id : conn.from_user_id
        );

        // Get users that current user is following (and they follow back - mutual)
        const following = Array.isArray(user?.following) ? user.following : [];
        const followers = Array.isArray(user?.followers) ? user.followers : [];
        const mutualFollowing = following.filter(id => followers.includes(id));

        // Combine: own posts + accepted connections + mutual following
        const userIds = Array.from(new Set([userId, ...connectedUserIds, ...mutualFollowing].filter(Boolean)));
        
        const posts = await Post.find({user:{$in:userIds}}).populate('user').sort({createdAt:-1});

        res.json({success:true,posts})

    }catch(error){
        console.log('getFeedPosts error:', error);
        res.json({success:false, message:error.message})
    }
}

//like post
export const likePost=async(req,res)=>{
    try{
        const {userId}=req;
        const {postId}=req.body;

        const post =await Post.findById(postId);

        if(post.likes_count.includes(userId)){
            post.likes_count=post.likes_count.filter((user)=>user!==userId);
            await post.save();
            res.json({success:true,message:'Post unliked'})
        }else{
            post.likes_count.push(userId);
            await post.save();
            res.json({success:true,message:'Post liked'})

        }

    }catch(error){
        console.log(error);
        res.json({success:false, message:error.message})
    }
}