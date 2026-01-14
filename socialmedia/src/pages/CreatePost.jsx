import React,{useState, useEffect} from 'react'
import { dummyUserData } from '../assets/assets'
import { Image, X } from 'lucide-react'
import toast from 'react-hot-toast'


const CreatePost = () => {

  const [content,setContent]=useState('')
  const [images,setImages]=useState([])
  const [imagePreviews,setImagePreviews]=useState([])
  const [loading,setLoading]=useState(false)

  useEffect(() => {
    const previews = images.map(file => URL.createObjectURL(file))
    setImagePreviews(previews)
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url))
    }
  }, [images])

  const user=dummyUserData;

  const handleSubmit=async()=>{
    
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* Title */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Create Post</h1>
          <p className='text-slate-600'>Share your thoughts with the world</p>
        </div>
        {/* form  */}
        <div className='max-w-xl bg-white p-4 sm:pb-3 rounded-xl shadow-md space-y-4'>
          {/* header  */}
          <div className='flex items-center gap-3'>
          <img src={user.profile_picture} alt="" className='w-12 h-12 rounded-full shadow' />
          <div>
            <h2 className='font-semisolid'>{user.full_name}</h2>
            <h2 className='text-sm text-gray-500'>@{user.username}</h2>
          </div>
          </div>
          {/* text area  */}
          <textarea className='w-full resize-none max-h-20 mt-4 text-sm outline-none placeholder-gray-400' 
          placeholder='whats happening?'
          onChange={(e)=>setContent(e.target.value)} 
          value={content}
          />
          {/* images  */}
          {
            images.length > 0 && <div className='flex flex-wrap gap-2 mt-4'>
              {
                imagePreviews.map((preview,i)=>(
                  <div key={i} className='relative group'>
                  <img src={preview} className='h-20 rounded-md'/>
                  <div onClick={()=>setImages(images.filter((_, index)=>index!==i))} className='absolute hidden group-hover:flex justify-center items-center top-0 bottom-0 left-0 bg-black/40 rounded-md cursor-pointer'>
                  <X className='w-6 h-6 text-white'/>

                  </div>
                  </div>
                ))
              }
               </div>
          }
          {/* Bottom bar */}
          <div className='flex items-center justify-between pt-3 border-t border-gray-300'>
            <label htmlFor="images" className='flex items-center gap-2 text-sm text-gray hover:text-gray-700 transition cursor-pointer'>
              <Image className='size-6'/>

            </label>
            <input type="file" id="images" accept='image/*' hidden multiple onChange={(e)=>setImages([...images,...Array.from(e.target.files)])}/>
            <button disabled={loading} onClick={()=>toast.promise(
              handleSubmit(),
              {
                loading:'uplaoding...',
                success:<p>Post Addded</p>,
                error:<p>Post Not Addded</p>,
              }
            )} className='text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white font-medium px-8 py-2 rounded-md cursor-pointer'>
              Publish Post
            </button>

          </div>

        </div>
      </div>
    </div>
  )
}

export default CreatePost