import React from 'react'
import { useState,useEffect } from 'react'
import { dummyUserData } from '../assets/assets'
import Loading from '../components/Loading.jsx'
import StoriesBar from '../components/StoriesBar.jsx'

const Feed = () => {

  const [feeds,setFeeds]=useState([])
  const [loading,setLoading]=useState(true)

  const fetchFeeds=async()=>{
    setFeeds(dummyUserData)
    setLoading(false)
  }

  useEffect(()=>{
    fetchFeeds();
  },[])

  return !loading ? (
    <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8'>
        {/*Stories and Post list*/}
        <div className=''>
          <StoriesBar />
          <div className='p-4 space-y-6'>
            List of posts
          </div>
        </div>
        {/*Right sidebar - Suggestions and User Info*/}
        <div>
          <div>
            <h1>Sponsered</h1>
          </div>
          <h1>Recent Messages</h1>
        </div>
    </div>
  ) : <Loading />
}
export default Feed