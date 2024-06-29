import React, { useEffect } from 'react'
import Dashboard from './Dashboard'
import MatchFinding from './MatchFinding';
import { useState } from 'react';
import { useUser } from '../components/UserContext';
import useRedirect from '../hooks/RedirectToLogin';

const Home = () => {
    const [showState, setShowState] = useState("dashboard");
    const { user, logout } = useUser();

    useRedirect();

    return (
    <div>
            <div className='flex justify-center items-center gap-x-4 mt-4'>
                <button className='bg-sky-400 hover:bg-sky-600 px-4 py-1 rounded-lg' onClick={() => setShowState("dashboard")}>Dashboard</button>
                <button className='bg-sky-400 hover:bg-sky-600 px-4 py-1 rounded-lg' onClick={() => setShowState("matchfinding")}>Matchfinding</button>
            </div>
            <h1 className='text-4xl ml-4'>{user ? `${user.username}` : ""}</h1>
        {
            showState == "matchfinding" ? (
                <MatchFinding />
            ) : (
                <Dashboard />
            )
        }
        <div className='flex justify-center my-12'>
        <button onClick={logout} className='border-2 border-red-900 bg-red-600 rounded-md p-3 text-white'>Logout</button>
        </div>
    </div>
    )
}

export default Home