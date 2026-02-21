import { BadgeCheck, Heart, MessageCircle, Share2, X } from 'lucide-react'
import React from 'react'
import moment from 'moment'
import { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import{useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const PostCard = ({ post }) => {

    const postWithHashtags=(post.content||'').replace(/(#\w+)/g,'<span class="text-indigo-600">$1</span>')

    const[likes,setLikes]=useState(post.likes_count || [])
    const [showComments,setShowComments]=useState(false)
    const [comments,setComments]=useState(post.comments || [])
    const [commentText,setCommentText]=useState('')
    const currentUser= useSelector((state)=>state.user.value);
    const user = post.user || dummyUserData
    const {getToken}=useAuth();
    
    const handleLike=async ()=>{
        try {
            const {data}=await api.post(`/api/post/like`,{postId: post._id},{headers:{Authorization:`Bearer ${await getToken()}`}})

            if(data.success){
                toast.success(data.message)
                setLikes(likes =>{
                    if(likes.includes(currentUser._id)){
                        return likes.filter((like)=>like!==currentUser._id)
                    }else{
                        return [...likes,currentUser._id]
                    }
                })
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleAddComment=async()=>{
        if(!commentText.trim()){
            toast.error('Please write a comment');
            return;
        }
        try{
            const token = await getToken();
            const {data}=await api.post('/api/post/comment/add',{postId:post._id,text:commentText},{headers:{Authorization:`Bearer ${token}`}})
            
            if(data.success){
                setComments(data.comments);
                setCommentText('');
                toast.success('Comment added');
            }else{
                toast.error(data.message);
            }
        }catch(error){
            toast.error(error.message);
        }
    }

    const navigate=useNavigate()

  return (
    <div className='bg-white rounded-xl shadow p-4 space-y-4 max-w-2xl'>
        {/* user info */}
        <div onClick={()=>user._id && navigate(`/profile/${user._id}`)} className='inline-flex items-center gap-3 cursor-pointer'>
            <img src={user.profile_picture || dummyUserData.profile_picture} alt="" className='w-10 h-10 rounded-full shadow'/>
            <div>
                <div className='flex items-center space-x-1'>
                    <span>{user.full_name}</span>
                    <BadgeCheck className='w-4 h-4 text-blue-500'/>
                </div>
                <div className='text-gray-500 text-sm'>@{user.username} . {moment(post.createdAt).fromNow()}</div>
            </div>
        </div>
        {/* content */}
        {post.content && <div className='text-gray-800 text-sm whitespace-pre-line' dangerouslySetInnerHTML={{ __html: postWithHashtags }}></div>}
        {/* images */}
        <div className='grid grid-cols-2 gap-2'>
            {(post.image_urls || []).map((img,index)=>{
                return <img key={index} src={img} alt="" className={`w-full h-48 object-cover rounded-lg ${(post.image_urls || []).length===1  && 'col-span-2 h-auto'}`}/>
            })}
        </div>

        {/* actions */}
        <div className='flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300'>
            <div className='flex items-center gap-1'>
                <Heart className={`w-4 h-4 cursor-pointer ${likes.includes(currentUser._id) && 'text-red-500 fill-red-500'}`} onClick={handleLike}/>
                <span>{likes.length}</span>
            </div>
            <div className='flex items-center gap-1 cursor-pointer' onClick={()=>setShowComments(!showComments)}>
                <MessageCircle className='w-4 h-4'/>
                <span>{comments.length}</span>
            </div>
            <div className='flex items-center gap-1'>
                <Share2 className='w-4 h-4 cursor-pointer'/>
                <span>{7}</span>
            </div>
        </div>

        {/* comments section */}
        {showComments && (
            <div className='pt-4 space-y-4 border-t border-gray-300'>
                <div className='space-y-3 max-h-64 overflow-y-auto'>
                    {comments.length === 0 ? (
                        <p className='text-gray-400 text-sm text-center py-4'>No comments yet</p>
                    ) : (
                        comments.map((comment,index)=>(
                            <div key={index} className='flex gap-3'>
                                <img src={comment.user?.profile_picture || dummyUserData.profile_picture} alt="" className='w-8 h-8 rounded-full'/>
                                <div className='flex-1'>
                                    <div className='bg-gray-100 rounded-lg p-2'>
                                        <div className='flex items-center gap-1'>
                                            <span className='font-semibold text-sm'>{comment.user?.full_name}</span>
                                            <span className='text-gray-500 text-xs'>@{comment.user?.username}</span>
                                        </div>
                                        <p className='text-sm text-gray-800'>{comment.text}</p>
                                    </div>
                                    <span className='text-xs text-gray-400'>{moment(comment.createdAt).fromNow()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* comment input */}
                <div className='flex gap-2 items-end'>
                    <img src={currentUser?.profile_picture || dummyUserData.profile_picture} alt="" className='w-8 h-8 rounded-full'/>
                    <div className='flex-1 flex gap-2'>
                        <input 
                            type="text" 
                            placeholder='Add a comment...' 
                            className='flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm'
                            value={commentText}
                            onChange={(e)=>setCommentText(e.target.value)}
                            onKeyPress={(e)=>e.key==='Enter' && handleAddComment()}
                        />
                        <button 
                            onClick={handleAddComment}
                            className='px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 text-sm font-medium'
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        )}

    </div>
  )
}

export default PostCard