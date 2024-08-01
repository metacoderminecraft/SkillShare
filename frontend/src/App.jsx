import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from "./pages/Login";
import SignUp from './pages/SignUp';
import CreateSkill from './pages/CreateSkill';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/home' element={<Home />} />
      <Route path='/matches/create' element={<CreateSkill />} />
      <Route path='/skills/create' element={<CreateSkill />} />
    </Routes>
  )
}

export default App