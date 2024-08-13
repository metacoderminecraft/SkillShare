import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../components/UserContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThreeDots from 'react-loading-icons/dist/esm/components/three-dots';

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
  }, [])
  
  const handleLogin = async () => {
    setLoading(true);

    if (!username || !password) {
      alert('Please put in a username/password');
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
      {
        loading ? (
          <div className='flex justify-center my-20'>
          <ThreeDots fill="#000000" />
          </div>
        ) : (
            <div className='flex flex-col items-center my-8'>
            <div className='flex flex-col border 2 border-sky-600 rounded-md w-[600px] p-4 mx-auto'>
              <div className='my-4'>
                <label className='text-2xl mr-4 text-gray-500'>Username</label>
                <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} className='border-2 border-gray-500 px-4 py-2 w-full text-xl' />
                <label className='text-2xl mr-4 text-gray-500'>Password</label>
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} className='border-2 border-gray-500 px-4 py-2 w-full text-xl' />
              </div>
              <button onClick={handleLogin} className='text-2xl'>Login</button>
            </div>
            {
              user ? (
                <div className='my-10' />
              ) : (
                <Link to={"/signup"} className='my-10 text-2xl'>
                Sign Up
                </Link>
              )
            }
          </div>
        )
      }
    </div>
  )
}

export default Login