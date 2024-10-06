import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../components/UserContext';
import { useState } from 'react';
import { ThreeDots } from 'react-loading-icons';

const Login = () => {
  const { user, login } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);
  
  const handleLogin = async () => {
    setLoading(true);

    if (!username || !password) {
      alert('Please enter a username and password.');
      setLoading(false);
      return;
    }

    const isLoggedIn = await login({ username, password });
    if (!isLoggedIn) {
      alert("Login failed");
    } else {
      navigate('/home');
    }

    setUsername("");
    setPassword("");
    setLoading(false);
  }

  return (
    <div>
      {loading ? (
        <div className='flex justify-center my-20'>
          <ThreeDots fill="#0A66C2" />
        </div>
      ) : (
        <div className='flex flex-col items-center my-8'>
          <div className='flex flex-col border-2 border-gray-300 rounded-md w-[400px] p-6 mx-auto shadow-md'>
            <div className='my-4'>
              <label className='block text-lg font-semibold text-gray-700 mb-2'>Username</label>
              <input
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className='border-2 border-gray-300 focus:border-blue-600 focus:outline-none px-4 py-2 w-full text-base rounded-md'
              />
              <label className='block text-lg font-semibold text-gray-700 mt-4 mb-2'>Password</label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='border-2 border-gray-300 focus:border-blue-600 focus:outline-none px-4 py-2 w-full text-base rounded-md'
              />
            </div>
            <button
              onClick={handleLogin}
              className='w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-2 rounded-md mt-4'
            >
              Login
            </button>
          </div>
          {!user && (
            <Link to={"/signup"} className='mt-6 text-blue-600 hover:text-blue-700 text-lg'>
              Sign Up
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default Login;