import React from 'react'
import BackButton from '../components/BackButton'
import { useState, useEffect } from 'react';
import { useUser } from '../components/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ThreeDots from 'react-loading-icons/dist/esm/components/three-dots';

const SignUp = () => {
  const { user, setUser } = useUser();
  const [signUpForm, setLoginForm] = useState({
    username: "",
    password: "",
    reEnterPassword: ""
  })
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [])

  const handleSignUp = async () => {
    setLoading(true);
    if (!signUpForm.username || !signUpForm.password || !signUpForm.reEnterPassword) {
      alert('Please enter all fields');
      setLoading(false);
      return;
    }

    if (signUpForm.reEnterPassword != signUpForm.password) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:1155/users/register", {
         username: signUpForm.username, 
         password: signUpForm.password,
        }, { withCredentials: true });
      setUser(response.data.user);
      navigate("/home");
    } catch (error) {
      if (error.response.status == 409) {
        alert("Username taken!");
      } else {
        alert("Sign Up Failed!");
        console.log(error);
      }
    }

    setLoginForm({
      username: "",
      password: "",
      reEnterPassword: ""
    })
    setLoading(false);
  }

  const handleChange = (e) => {
    const entry = e.target.name;

    setLoginForm({
      ...signUpForm,
      [entry]: e.target.value
    })
  } 

  return ( 
    <div>
      {
        loading ? (
          <div className='flex justify-center my-20'>
          <ThreeDots fill="#000000" />
          </div>
        ) : (
          <div>
          <BackButton />
          <div className='flex flex-col border 2 border-sky-600 rounded-md w-[600px] p-4 mx-auto'>
            <div className='my-4'>
              <label className='text-2xl mr-4 text-gray-500'>Username</label>
              <input type='text' name="username" value={signUpForm.username} onChange={handleChange} className='border-2 border-gray-500 px-4 py-2 w-full text-xl' />
              <label className='text-2xl mr-4 text-gray-500'>Password</label>
              <input type='password' name='password' value={signUpForm.password} onChange={handleChange} className='border-2 border-gray-500 px-4 py-2 w-full text-xl' />
              <label className='text-2xl mr-4 text-gray-500'>Re-Enter Password</label>
              <input type='password' name='reEnterPassword' value={signUpForm.reEnterPassword} onChange={handleChange} className='border-2 border-gray-500 px-4 py-2 w-full text-xl' />
            </div>
            <button onClick={handleSignUp} className='text-2xl my-4'>Sign Up</button>
          </div>
        </div>
        )
    }
    </div>
  )
}

export default SignUp