import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'
function Card({image}) {
    const{
     serverUrl,userData,setUserData,
        frontendImage,setfrontendImage,
       backendImage, setbackendImage,
        SelectedImage,setSelectedImage
    }= useContext(userDataContext)
  
  return (
    <div className={`w-[70px] h-[140px]   md:w-[150px] md:h-[220px] bg-blue-950 border-2 rounded-2xl border-blue-900  overflow-hidden hover:shadow-2xl hover:shadow-blue-900 cursor-pointer hover:border-4 hover:border-white hover:scale-95 object-cover ${SelectedImage==image?"border-4 border-white shadow-2xl shadow-blue-900":null}`} onClick={()=>{
      setSelectedImage(image)
        setbackendImage(null);
        setfrontendImage(null);
    }}>

        <img src={image} className='h-full object-cover ' />
     
    </div>
  )
}

export default Card
