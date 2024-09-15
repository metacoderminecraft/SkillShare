import React from 'react'
import { useState, useEffect } from 'react';
import { useUser } from '../components/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ThreeDots from 'react-loading-icons/dist/esm/components/three-dots';
import { Link } from 'react-router-dom';

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
    <div className='bg-gray-100 h-screen w-screen absolute'>
      {
        loading ? (
          <div className='flex justify-center my-20'>
          <ThreeDots fill="#000000" />
          </div>
        ) : (
          <div>
            <img src='../FullLogo.png' className='h-[50px] mt-8 mx-8'></img>
            <div className='flex flex-col items-center'>
              <h1 className='text-3xl mb-8'>The world is at your fingertips</h1>
              <div className=' bg-white rounded-md w-[400px] p-4 mx-auto my-4 flex flex-col items-center'>
                  <input type='text' name="username" placeholder='Username' value={signUpForm.username} onChange={handleChange} className='border-[1px] border-gray-400 placeholder-gray-500 px-3 py-3 rounded-md w-full text-xl mb-5 mt-2' />
                  <input type='password' name='password' placeholder='Password' value={signUpForm.password} onChange={handleChange} className='border-[1px] border-gray-400 placeholder-gray-500 px-3 py-3 rounded-md mb-5 w-full text-xl' />
                  <input type='password' name='reEnterPassword' placeholder='Re-enter Password' value={signUpForm.reEnterPassword} onChange={handleChange} className='border-[1px] mb-4 border-gray-400 placeholder-gray-500 px-3 py-3 rounded-md w-full text-xl' />
                  <button onClick={handleSignUp} className='font-semibold my-4 bg-blue-600 rounded-full p-3 hover:bg-blue-800 w-full text-white mb-8'>Sign Up</button>
                  <div className='text-lg my-8'>
                    Already on SkillShare?
                    <Link to={"../login"} className=' ml-2 text-blue-600 font-semibold hover:underline hover:bg-blue-200 rounded-full p-2'>Sign in</Link>
                  </div>
              </div>
            </div>
        </div>
        )
    }
    </div>
  )
}

export default SignUp