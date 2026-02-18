import React from 'react'
import { useNavigate } from 'react-router-dom';
import {assets, dummyUserData} from '../assets/assets';
import MenuItems from './MenuItems';
import { Link } from 'react-router-dom';
import { CirclePlus, LogOut } from 'lucide-react';
import { SignUp, UserButton,useClerk } from '@clerk/clerk-react';
import { useSelector } from 'react-redux';
const Sidebar = ({sidebarOpen,setSidebarOpen}) => {

    const navigate=useNavigate();
    const user =useSelector((state)=>state.user.value);
    const {signOut}=useClerk();

  return (
    <div className={`w-60 xl:w-72 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-0 bottom-0 z-20 ${
    sidebarOpen ? 'translate-x-0':'max-sm:-translate-x-full'} transition-all duration-300 ease-in-out`}>
        <div className='w-full'>
            {/* <img onClick={() => navigate('/')} src={assets.logo} className='w-26 ml-7 my-2 cursor-pointer' alt="" /> */}
            <h1 className='flex align-center px-5 justify-start m-5 font-medium text-blue-700 text-3xl'>Social Media</h1>
            <hr className='border-gray-300 mb-8'/>
            <MenuItems setSidebarOpen={setSidebarOpen}/>
            <Link to='/create-post' className='m-6 mx-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center gap-2'>
                <CirclePlus className='w-5 h-5'/>
                Create Post
            </Link>
        </div>
            <div className='w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between'>
                <div className='flex gap-2 items-center cursor-pointer'>
                    <UserButton/>
                    <div>
                        <h1 className='text-sm font-medium'>{user.full_name}</h1>
                        <p  className='text-xs text-gray-500'>{user.username}</p>
                    </div>
                </div>
                <LogOut onClick={signOut} className='w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer'/>
            </div>
    </div>
  )
}

export default Sidebar