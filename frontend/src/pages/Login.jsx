import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from './UserContext'
import { useState } from 'react'

const Login = () => {
  const { user, login, logout } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const handleLogin = () => {
    if (username && password) {
      login({ username: username, password: password });
      setUsername("");
      setPassword("");
    }
  }

  const handleLogout = () => {
    logout();
    setUsername("");
    setPassword("");
  }

  return (
    <div className='flex flex-col items-center my-8 text-2xl'>
      <div className='flex flex-col border 2 border-sky-600 rounded-md w-[600px] p-4 mx-auto'>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Username</label>
          <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} className='border-2 border-gray-500 px-4 py-2 w-full' />
          <label className='text-xl mr-4 text-gray-500'>Password</label>
          <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} className='border-2 border-gray-500 px-4 py-2 w-full' />
        </div>
        <button onClick={handleLogin}>Login</button>
        {
          user ? (
            <div>
              <p>you are {user.username}</p>
              <p>you're password is {user.password}</p>
            </div>
          ) : (
            <p>yo who are you</p> 
          )
        }
      </div>
      <Link to={"/signup"} className='my-10'>
        Sign Up
      </Link>
      <button className='my-4' onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Login