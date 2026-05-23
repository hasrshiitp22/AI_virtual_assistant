import React, { useActionState, useContext } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../context/UserContext'
import axios from "axios"

function SignIn() {
   const navigate= useNavigate()
   const [email, setEmail] = useState("")
   const[password,setPassword]=useState("")
   const[err,setErr]=useState("")



   const {serverUrl,userData,setUserData}=useContext(userDataContext)
   const handleSignup=async (e) => {
    e.preventDefault()
     console.log("FORM SUBMITTED")
     setErr("")
     console.log("URL:", `${serverUrl}/api/auth/signIn`)
    try{

   let result= await axios.post(`${serverUrl}/api/auth/signin`,{
    email,password
   },{withCredentials:true})
   setUserData(result.data)
   navigate("/")
    }catch(error){
         console.log("ERROR:", error)
         setUserData(null)
        setErr(error.response.data.message)
    }
   }

  return (
   <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{backgroundImage:`url(https://wallpapercave.com/wp/wp1913262.jpg)`}} >
    <form className='w-[90%] h-[450px] max-w-[400px] bg-[#00000018] backdrop-blur shadow-black flex flex-col items-center justify-center' onSubmit={handleSignup}>
        <h1 className='text-white text-3xl mb-12'>Login to <span className='text-blue-400 text-2xl'>Virtual Assistant</span></h1>
       
          <input className='text-white border-2 border-white bg-transparent w-[70%] h-8 rounded-2xl px-4 text-sm mb-4' type="email" placeholder='Enter your email' required onChange={(e)=>{
            setEmail(e.target.value)
          }}
          value={email} />
            <input className='text-white border-2 border-white bg-transparent w-[70%] h-8 rounded-2xl px-4 text-sm mb-8' type="password" placeholder='Enter your password' required onChange={(e)=>{
              setPassword(e.target.value)
             
            }}  value={password}/>
      {err.length>0 && <p className='text-red-500'>
         *{err}
      </p> }
           
      <button className="submit h-8 rounded-full bg-white text-black w-24 cursor-pointer">
      Sign In
      </button>
      <p className='text-white text-sm mt-10' onClick={()=>
            navigate('/signup')} >Create a New account ? 
        <span className='p-4 text-blue-400 font-bold cursor-pointer'  >Sign up</span>
      </p>

    </form>
   </div>
  )
}

export default SignIn
   