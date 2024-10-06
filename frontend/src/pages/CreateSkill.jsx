import React, { useState, useEffect } from 'react';
import BackButton from "../components/BackButton";
import { useUser } from '../components/UserContext';
import { ThreeDots } from 'react-loading-icons';
import useRedirect from '../hooks/RedirectToLogin';
import axios from 'axios';

const CreateSkill = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [focus, setFocus] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useUser();
  const focusOptions = ["Tech", "Art", "Wellness", "Sports"];

  useRedirect();

  const handleSaveSkill = async () => {
    setErrorMessage("");
    if (!title || !focus || !description) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:1155/skills/create",
        { title, description, focus },
        { withCredentials: true }
      );
      setTitle("");
      setFocus("");
      setDescription("");
    } catch (error) {
      console.log(error);
      setErrorMessage("An error occurred while saving the skill.");
    }
    setLoading(false);
  };

  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-4'>
      {loading || !user ? (
        <div className='flex justify-center'>
          <ThreeDots fill="#7E60BF" />
        </div>
      ) : (
        <div className='w-full max-w-md bg-white rounded-lg shadow-md p-6'>
          <BackButton />
          <h2 className='text-2xl font-semibold text-gray-800 mb-6 text-center'>
            Create New Skill
          </h2>
          {errorMessage && (
            <div className='text-red-500 text-sm mb-4 text-center'>
              {errorMessage}
            </div>
          )}
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Title
              </label>
              <input
                type='text'
                maxLength='25'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Enter skill title'
                className='border-2 border-gray-300 focus:border-primary focus:ring-primary rounded-md w-full px-3 py-2 transition duration-200'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Focus
              </label>
              <select
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                className='border-2 border-gray-300 focus:border-primary focus:ring-primary rounded-md w-full px-3 py-2 transition duration-200'
              >
                <option value='' disabled>
                  Select focus area
                </option>
                {focusOptions.map((option) => (
                  <option key={option} value={option.toLowerCase()}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Description
              </label>
              <textarea
                maxLength='500'
                rows='6'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Describe your skill'
                className='border-2 border-gray-300 focus:border-primary focus:ring-primary rounded-md w-full px-3 py-2 transition duration-200 resize-none'
              />
            </div>
            <button
              onClick={handleSaveSkill}
              className='w-full bg-primary hover:bg-secondary text-white font-semibold py-2 rounded-md transition duration-200'
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateSkill;