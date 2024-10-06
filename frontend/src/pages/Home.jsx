import React, { useEffect } from 'react'
import Dashboard from './Dashboard'
import MatchFinding from './MatchFinding';
import { useState } from 'react';
import { useUser } from '../components/UserContext';
import useRedirect from '../hooks/RedirectToLogin';
import { MdAdd } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Home = () => {
    const [showState, setShowState] = useState("dashboard");
    const { user, logout } = useUser();

    useRedirect();

    return (
        <div>
            {/* Navigation Buttons */}
            <div className='flex justify-center items-center gap-x-4 mt-4'>
                <button
                    className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg'
                    onClick={() => setShowState("dashboard")}
                >
                    Dashboard
                </button>
                <button
                    className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg'
                    onClick={() => setShowState("matchfinding")}
                >
                    Matchfinding
                </button>
            </div>

            {/* Header with Username and Icons */}
            <div className='flex flex-row items-center mt-6'>
                <h1 className='text-4xl ml-4 font-semibold text-gray-800'>
                    {user ? `${user.username}` : ""}
                </h1>
                <div className='flex-grow' />
                <Link to={"../matches/create"} className='mr-4'>
                    <MdAdd className='text-4xl text-blue-600 hover:text-blue-700' />
                </Link>
                <Link to={"../skills/create"} className='mr-4'>
                    <MdAdd className='text-4xl text-blue-600 hover:text-blue-700' />
                </Link>
            </div>

            {/* Content Display */}
            {showState === "matchfinding" ? <MatchFinding /> : <Dashboard />}

            {/* Logout Button */}
            <div className='flex justify-center my-12'>
                <button
                    onClick={logout}
                    className='border-2 border-gray-400 bg-white text-gray-600 hover:bg-gray-100 rounded-md p-3'
                >
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Home