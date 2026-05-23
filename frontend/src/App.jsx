import { useContext, useState } from 'react'
import reactLogo from './assets/react.svg'

import { Routes,Route, Navigate } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Customize from './pages/Customize'
import { userDataContext } from './context/UserContext'
import Home from './pages/Home'
import Customize2 from './pages/Customize2'

function App() {
  const {userData,setUserData}=useContext(userDataContext)
  return (
  <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/signup' element={  <SignUp/> }/>
    <Route path='/signin' element={ <SignIn/>}/>
    <Route path='/customize' element={<Customize/>}/>
     <Route path='/customize2' element={<Customize2/>}/>
    </Routes>
  )
}

export default App
