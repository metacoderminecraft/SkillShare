import React from 'react'
import BackButton from '../components/BackButton'
import { useState, useEffect } from 'react';
import { useUser } from '../components/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const { user, setUser } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [])

  const handleSignUp = async () => {
    if (!username || !password) {
      alert('Please put in a username/password');
    }

    try {
      const response = await axios.post("http://localhost:1155/users/register", { username, password }, { withCredentials: true });
      setUser(response.data.user);
      navigate("/home");
    } catch (error) {
      alert("Sign Up Failed!");
      console.log(error);
    }

    setUsername("");
    setPassword("");
  }

  return (
    <div>
      <BackButton />
      <div className='flex flex-col border 2 border-sky-600 rounded-md w-[600px] p-4 mx-auto'>
        <div className='my-4'>
          <label className='text-2xl mr-4 text-gray-500'>Username</label>
          <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} className='border-2 border-gray-500 px-4 py-2 w-full text-xl' />
          <label className='text-2xl mr-4 text-gray-500'>Password</label>
          <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} className='border-2 border-gray-500 px-4 py-2 w-full text-xl' />
        </div>
        <button onClick={handleSignUp} className='text-2xl my-4'>Sign Up</button>
      </div>
    </div>
  )
}

export default SignUp