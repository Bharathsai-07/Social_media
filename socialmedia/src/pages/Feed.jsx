import React from 'react'
import { useState,useEffect } from 'react'
import { dummyUserData ,dummyPostsData} from '../assets/assets'
import Loading from '../components/Loading.jsx'
import StoriesBar from '../components/StoriesBar.jsx'
import PostCard from '../components/PostCard.jsx'
import sponsored_img from '../assets/sponsored_img.png'
import RecentMessages from '../components/RecentMessages.jsx'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'
import api from '../api/axios.js'

const Feed = () => {

  const [feeds,setFeeds]=useState([])
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState(null)
  const {getToken}=useAuth();

  const fetchFeeds=async()=>{
    try {
      setLoading(true);
      setError(null);
      const {data}=await api.get('/api/post/feed',{headers:{
        Authorization:`Bearer ${await getToken()}`
      }})
      if(data.success){
        setFeeds(data.posts);
      }else{
        setError(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      
    }
    setLoading(false);
  }

  useEffect(()=>{
    fetchFeeds();
  },[])

  return !loading ? (
    <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8'>
        {/*Stories and Post list*/}
        <div>
          <StoriesBar />
          <div className='p-4 space-y-6'>
            {error ? (
              <div className='text-center text-red-500 py-10'>
                <p>Error loading feed: {error}</p>
              </div>
            ) : feeds.length === 0 ? (
              <div className='text-center text-gray-500 py-10'>
                <p>No posts yet. Follow or connect with people to see their posts!</p>
              </div>
            ) : (
              feeds.map((post)=>(
                <PostCard key={post._id} post={post}/>
              ))
            )}
          </div>
        </div>
        {/*Right sidebar - Suggestions and User Info*/}
        <div className='max-xl:hidden sticky top-0'>
          <div className='max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow'>
            <h3 className='text-slate-800 font-semibold'>Sponsered</h3>
            <img src={sponsored_img} alt="" className='w-75 h-50 rounded-md' />
            <p className='text-slate-600'>Email marketing</p>
            <p className='text-slate-400'>upercharge your marketing with a powerful, easy-to-use platform built for results.</p>
          </div>
          <RecentMessages/>
        </div>
    </div>
  ) : <Loading />
}
export default Feed