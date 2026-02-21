import imagekit from "../configs/imageKit.js";
import FileSystem from 'fs';
import Story from "../models/Story.js";
import User from "../models/user.js";
import Connection from "../models/Connection.js";
import { inngest } from "../inngest/index.js";

export const addUserStory =async(req,res)=>{
    try{
        const {userId} = req;
        const {content, media_type, background_color}=req.body;
        const media=req.file
        let media_url='';

        if(media_type==='image'||media_type==='video'){
            const fileBuffer=FileSystem.readFileSync(media.path);
            const response =await imagekit.upload({
                file:fileBuffer,
                fileName:media.originalname,
            })
            media_url=response.url
        }

        const story=await Story.create({
            user:userId,
            content,
            media_url,
            media_type,
            background_color
        })

        //schedule story del after 24 hr
        await inngest.send({
            name:'app/story.delete',
            data:{storyId: story._id}
        })

        res.json({success:true,story})

    }catch(error){
        console.log(error);
        res.json({success:false, message:error.message})
    }
}


export const getStories =async(req,res)=>{
    try{
        const {userId} = req;
        const user = await User.findById(userId);

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

        // Combine: own stories + accepted connections + mutual following
        const userIds = Array.from(new Set([userId, ...connectedUserIds, ...mutualFollowing].filter(Boolean)));

        const stories = await Story.find({ user: { $in: userIds } }).populate('user').sort({createdAt:-1});

        res.json({success:true,stories})

    }catch(error){
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

