import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateMatch from './pages/CreateMatch';
import Login from "./pages/Login";
import SignUp from './pages/SignUp';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/home' element={<Home />} />
      <Route path='/matches/create' element={<CreateMatch />} />
    </Routes>
  )
}

export default App