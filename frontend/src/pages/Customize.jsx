import React, { useActionState, useContext, useRef, useState } from 'react'
import { FaFileUpload } from "react-icons/fa";4
import { useNavigate } from 'react-router-dom';
import Customize2 from './Customize2';
import Card from '../components/Card'
import images11 from "../assets/images11.avif"
import images2 from "../assets/images12.png"
import images3 from "../assets/images13.png"
import images6 from "../assets/image6.jpg"
import images9 from "../assets/image9.jpg"
import images10 from "../assets/images10.jpg"
import images1 from "../assets/image1.png"
import { userDataContext } from '../context/UserContext';

function Customize() {
   const{
   serverUrl,userData,setUserData,
      frontendImage,setfrontendImage,
     backendImage, setbackendImage,
      SelectedImage,setSelectedImage
  }=useContext(userDataContext)

  const Navigate=useNavigate();
   const inputimage=useRef()
   const handleImage=(e)=>{
    const file=e.target.files[0]
    setbackendImage(file)
    setfrontendImage(URL.createObjectURL(file))
   }
  return (
    <div className='w-full  h-[100vh] bg-blend-color-dodge bg-[#030101] flex justify-center items-center flex-col'>  
    <h1 className='text-white text-3xl text-center mb-8 mt-4'>Select your <span className='text-blue-400'>Assistant Image</span></h1>
    <div className='w-[90%] max-w-[80%] flex justify-center items-center flex-wrap gap-4 object-cover'>
          <Card image={images11}/>
          <Card image={images2}/>
           <Card image={images3}/>
            <Card image={images6}/>
            <Card image={images9}/>
             <Card image={images1}/>
       <div className={`w-[70px] h-[140px]   md:w-[150px] md:h-[220px] bg-blue-950 border-2 rounded-2xl border-blue-900  overflow-hidden hover:shadow-2xl hover:shadow-blue-900 cursor-pointer hover:border-4 hover:border-white hover:scale-95  ${SelectedImage=="input"?"border-4 border-white shadow-2xl shadow-blue-900":null} `}onClick={()=>{inputimage.current.click()
        setSelectedImage("input")
      
       }}>

        {!frontendImage && <div className='flex items-center justify-center mt-20'><FaFileUpload color='red' size={30} />
       </div>}
       {frontendImage && <img src={frontendImage} className='h-full object-cover' /> }
       
     
    </div>    
      <input type="file" accept='image/*' hidden ref={inputimage} onChange={handleImage}/>  
     
    </div>
    {SelectedImage &&  <button className='h-8 rounded-full bg-white text-black w-24 cursor-pointer mt-4 p-4 align-middle items-center flex justify-center mb-4'   onClick={()=>Navigate("/customize2")} >Next</button> }
   
    </div>
  )
}

export default Customize
