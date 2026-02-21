import React, { useRef } from 'react'
import { Route,Routes, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Messages from './pages/Messages'
import ChatBox from './pages/ChatBox'
import Connections from './pages/Connections'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import {useUser,useAuth} from '@clerk/clerk-react'
import Layout from './pages/Layout'
import toast, {Toaster} from 'react-hot-toast'
import Notification from './components/Notification'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from './features/user/userSlice'
import { fetchConnections } from './features/connections/connectionSlice'
import { addMessage } from './features/messages/messageSlice.js'


const App = () => {
  const {user} = useUser()
  const {getToken}=useAuth();
  const {pathname}=useLocation()
  const pathnameRef=useRef(pathname)
  const dispatch=useDispatch();
  const backendUser = useSelector((state)=>state.user.value)
  
  useEffect(()=>{
    const fetchData=async()=>{
      if(user){
        const token=await getToken();
        dispatch(fetchUser(token));
        dispatch(fetchConnections(token))
      }
    }
    fetchData();
  },[user,getToken,dispatch])

  useEffect(()=>{
    pathnameRef.current=pathname
  },[pathname])

  useEffect(()=>{
    if(backendUser && backendUser._id){
      const base = (import.meta.env.VITE_BASEURL || '').replace(/\/$/, '');
      const eventSource=new EventSource(`${base}/api/message/${backendUser._id}`);

      eventSource.onmessage=(event)=>{
        try{
          const message=JSON.parse(event.data);
          const fromUserId = message?.from_user_id?._id || message?.from_user_id;

          if(pathnameRef.current === (`/messages/${fromUserId}`)){
            dispatch(addMessage(message));
          }else{
            toast.custom((t)=>(
              <Notification t={t} message={message}/>
            ),{position:"bottom-right"})
          }
        }catch(e){
          console.log('SSE parse error', e);
        }
      }
      return ()=>{
        eventSource.close();
      }
    }
  },[backendUser, dispatch])

  return (
    <>
      <Toaster />
        <Routes>
          <Route path="/" element={!user?<Login />:<Layout />}>
            <Route index element={<Feed />} />
            <Route path='messages' element={<Messages />}/> 
            <Route path='messages/:userId' element={<ChatBox />}/> 
            <Route path='Connections' element={<Connections />}/> 
            <Route path='discover' element={<Discover />}/> 
            <Route path='profile' element={<Profile />}/> 
            <Route path='profile/:profileId' element={<Profile />}/>
            <Route path='create-post' element={<CreatePost />}/>
          </Route>
        </Routes>
    </>
  )
}

export default App