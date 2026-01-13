import React from 'react'
import { dummyConnectionsData } from '../assets/assets'

const Messages = () => {
  return (
    <div className='min-h-screen relative bg-slate-50'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* title */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Messages</h1>
          <p className='text-slate-600'>Talk to your friends and family</p>
        </div>
        {/* connected users */}
        <div className='flex flex-col gap-4'>
          {
            dummyConnectionsData.map((user)=>(
              <div key={user._id} className='max-w-xl flex flex-warp gap-5 p-6 bg-white shadow rounded-md'>
              <img src={user.profile_picture} alt="" className='rounded-full size-12 mx-auto' />
              <div>
                <p>{user.full_name}</p>
                <p>@{user.username}</p>
                <p>{user.bio}</p>
              </div>
              </div>
            ))
          }
        </div>
      </div>      
        
    </div>
  )
}

export default Messages