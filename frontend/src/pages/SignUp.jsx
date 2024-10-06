import React, { useEffect, useState } from 'react';
import BackButton from '../components/BackButton';
import { useUser } from '../components/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ThreeDots } from 'react-loading-icons';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const { user, setUser } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const handleSignUp = async () => {
    setLoading(true);
    setErrorMessage('');

    if (!username || !password || !reEnterPassword) {
      setErrorMessage('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (password !== reEnterPassword) {
      setErrorMessage("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:1155/users/register',
        { username, password },
        { withCredentials: true }
      );
      setUser(response.data.user);
      navigate('/home');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage('Username is already taken.');
      } else {
        setErrorMessage('Sign Up Failed. Please try again.');
        console.log(error);
      }
    }

    setLoading(false);
  };

  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-4'>
      {loading ? (
        <div className='flex justify-center'>
          <ThreeDots fill='#7E60BF' />
        </div>
      ) : (
        <div className='w-full max-w-md bg-white rounded-lg shadow-md p-6'>
          <BackButton />
          <h2 className='text-2xl font-semibold text-gray-800 mb-6 text-center'>
            Sign Up
          </h2>
          {errorMessage && (
            <div className='text-red-500 text-sm mb-4 text-center'>
              {errorMessage}
            </div>
          )}
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Username
              </label>
              <input
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Choose a username'
                className='border-2 border-gray-300 focus:border-primary focus:ring-primary rounded-md w-full px-3 py-2 transition duration-200'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Password
              </label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter your password'
                className='border-2 border-gray-300 focus:border-primary focus:ring-primary rounded-md w-full px-3 py-2 transition duration-200'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Re-enter Password
              </label>
              <input
                type='password'
                value={reEnterPassword}
                onChange={(e) => setReEnterPassword(e.target.value)}
                placeholder='Confirm your password'
                className='border-2 border-gray-300 focus:border-primary focus:ring-primary rounded-md w-full px-3 py-2 transition duration-200'
              />
            </div>
            <button
              onClick={handleSignUp}
              className='w-full bg-primary hover:bg-secondary text-white font-semibold py-2 rounded-md transition duration-200'
            >
              Sign Up
            </button>
          </div>
          <p className='mt-6 text-center text-sm text-gray-600'>
            Already have an account?{' '}
            <Link
              to='/login'
              className='text-primary hover:text-secondary font-medium transition duration-200'
            >
              Login
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default SignUp;