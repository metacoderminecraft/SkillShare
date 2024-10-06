import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ThreeDots } from 'react-loading-icons';

const MatchFinding = () => {
  const [loading, setLoading] = useState(false);
  const [currMatch, setCurrMatch] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRequest = async () => {
    if (!currMatch) {
      setErrorMessage('No match to send a request to.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await axios.post(
        'http://localhost:1155/matches/request',
        { recipient: currMatch.username, date: new Date() },
        { withCredentials: true }
      );
      setSuccessMessage('Match request sent successfully!');
    } catch (error) {
      console.log(error);
      setErrorMessage('An error occurred while sending the match request.');
    }
    setLoading(false);
  };

  const findMatch = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const response = await axios.get('http://localhost:1155/users/match', {
        withCredentials: true,
      });
      setCurrMatch(response.data.user);
      if (!response.data.user) {
        setErrorMessage('No match found at this time.');
      }
    } catch (error) {
      console.log(error);
      setErrorMessage('An error occurred while finding a match.');
    }
    setLoading(false);
  };

  useEffect(() => {
    findMatch();
  }, []);

  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-4'>
      {loading ? (
        <div className='flex justify-center'>
          <ThreeDots fill='#7E60BF' />
        </div>
      ) : (
        <div className='w-full max-w-md bg-white rounded-lg shadow-md p-6 text-center'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
            {currMatch ? currMatch.username : 'Find a Match'}
          </h2>
          {errorMessage && (
            <div className='text-red-500 text-sm mb-4'>{errorMessage}</div>
          )}
          {successMessage && (
            <div className='text-green-500 text-sm mb-4'>{successMessage}</div>
          )}
          <div className='space-y-4'>
            <button
              onClick={findMatch}
              className='w-full bg-primary hover:bg-secondary text-white font-semibold py-2 rounded-md transition duration-200'
            >
              Search for Match
            </button>
            <button
              onClick={handleRequest}
              className='w-full bg-primary hover:bg-secondary text-white font-semibold py-2 rounded-md transition duration-200'
            >
              Send Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchFinding;