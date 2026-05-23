import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Customize2() { 
    
    const {userData,backendImage,SelectedImage,serverUrl,setUserData}=useContext(userDataContext)
    const[assistantName,setassistantName]=useState(userData?.assistantName || "alexa" );
    const Navigate=useNavigate()
   const handleUpdateAssistant=async()=>{
    try {
      let formData=new FormData()
      formData.append("assistantName",assistantName)
      if(backendImage){
          formData.append("assistantImage",backendImage)
      }else{
        formData.append("imageUrl",SelectedImage)
      }
      const result=await axios.post(`${serverUrl}/api/auth/update`,formData,{withCredentials:true})
      setUserData(result.data);
      console.log(result.data)
    } catch (error) {
      console.log(error)
    }
   }

  return (
  <div className='w-full  h-[100vh] bg-blend-color-dodge bg-[#030101] flex justify-center items-center flex-col'>  
       <h1 className='text-white text-3xl text-center mb-8 mt-4'>Enter your <span className='text-blue-400'>Assistant Name</span></h1>

               <input className=' font-bold text-amber-400 border-2 border-white bg-transparent w-[40%] h-8 rounded-2xl py-4 px-4 mb-4 text-sm px-2' type="text" placeholder='eg-Alexa'
           onChange={(e)=>setassistantName(e.target.value) } value={assistantName}
          />
         {assistantName &&  <button className='h-8 rounded-full bg-white text-black w-24 cursor-pointer mt-4 p-4 align-middle items-center flex justify-center mb-4'   onClick={()=>{
              
                handleUpdateAssistant();
                Navigate('/')
         }
  
          
         } >Next</button> }
         

    </div>
  )
}

export default Customize2
