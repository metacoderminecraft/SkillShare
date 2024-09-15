import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../components/UserContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThreeDots from 'react-loading-icons/dist/esm/components/three-dots';

const Login = () => {
  const { user, login } = useUser();
  const [loginForm, setLoginForm] = useState({ username: "", password: ""})
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [])
  
  const handleLogin = async () => {
    setLoading(true);

    if (!loginForm.username || !loginForm.password) {
      alert('Please put in a username/password');
      setLoading(false);
      return;
    }

    const isLoggedIn = await login({ username: loginForm.username, password: loginForm.password });
    if (!isLoggedIn) {
      alert("Login failed");
    } else {
      navigate('/home');
    }

    setLoginForm({username:"", password:""});
    setLoading(false);
  }

  const handleChange = (e) => {
    const entry = e.target.name;

    setLoginForm({
      ...loginForm,
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
            <img src='../FullLogo.png' className='h-[50px] mt-8 mx-8'></img>
            <div className='flex flex-col items-center'>
              <div className='flex flex-col border-2 border-gray-100 shadow-lg rounded-lg w-[350px] p-6 mx-auto'>
                  <h1 className='text-3xl font-semibold mb-1'>Sign In</h1>
                  <p className='text-sm'>Get to learning your new skills</p>
                  <div className='mt-4'>
                    <input type='text' name='username' placeholder='Username' value={loginForm.username} onChange={handleChange} className='border-[1px] border-gray-600 placeholder-gray-500 px-3 py-3 w-full text-xl mb-5 rounded-md' />
                    <input type='password' name='password' placeholder='Password' value={loginForm.password} onChange={handleChange} className='border-[1px] border-gray-600 placeholder-gray-500 px-3 py-3 w-full text-xl rounded-md' />
                    <button onClick={handleLogin} className='bg-blue-600 rounded-full p-4 text-white w-full mt-16 mb-4 hover:bg-blue-800'>Login</button>
                  </div>
              </div>
              <div className='text-lg my-8'>
                New to SkillShare?
                <Link to={"../signup"} className=' ml-2 text-blue-600 font-semibold hover:underline hover:bg-blue-200 rounded-full p-2'>Join now</Link>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default Login