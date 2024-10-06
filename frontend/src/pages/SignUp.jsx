import React, { useEffect, useState } from 'react';
import BackButton from '../components/BackButton';
import { useUser } from '../components/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ThreeDots } from 'react-loading-icons';

const SignUp = () => {
  const { user, setUser } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleSignUp = async () => {
    setLoading(true);
    if (!username || !password || !reEnterPassword) {
      alert('Please enter all fields');
      setLoading(false);
      return;
    }

    if (reEnterPassword !== password) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:1155/users/register",
        { username, password },
        { withCredentials: true }
      );
      setUser(response.data.user);
      navigate("/home");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("Username taken!");
      } else {
        alert("Sign Up Failed!");
        console.log(error);
      }
    }

    setUsername("");
    setPassword("");
    setReEnterPassword("");
    setLoading(false);
  };

  return (
    <div>
      {loading ? (
        <div className='flex justify-center my-20'>
          <ThreeDots fill="#0A66C2" />
        </div>
      ) : (
        <div className='flex flex-col items-center my-8'>
          <BackButton />
          <div className='flex flex-col border-2 border-gray-300 rounded-md w-[400px] p-6 mx-auto shadow-md mt-4'>
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
              <label className='block text-lg font-semibold text-gray-700 mt-4 mb-2'>Re-enter Password</label>
              <input
                type='password'
                value={reEnterPassword}
                onChange={(e) => setReEnterPassword(e.target.value)}
                className='border-2 border-gray-300 focus:border-blue-600 focus:outline-none px-4 py-2 w-full text-base rounded-md'
              />
            </div>
            <button
              onClick={handleSignUp}
              className='w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-2 rounded-md mt-4'
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;