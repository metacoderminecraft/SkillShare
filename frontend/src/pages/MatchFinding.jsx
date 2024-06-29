import axios from 'axios';
import React, { useEffect } from 'react'
import ThreeDots from 'react-loading-icons/dist/esm/components/three-dots';
import { useState } from 'react';

const MatchFinding = () => {
    const [loading, setLoading] = useState(false);
    const [currMatch, setCurrMatch] = useState({});

    const handleRequest = async () => {
        if(!currMatch) {
            return;
        }

        setLoading(true);
        try {
            await axios.post("http://localhost:1155/matches/request", { recipient: currMatch.username, date: (new Date()) }, { withCredentials: true });
        } catch (error) {
            console.log(error);
        }

        setLoading(false);
    }

    const findMatch = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:1155/users/match", { withCredentials: true });

            setCurrMatch(response.data.user);
        } catch (error) {
            console.log(error);
        }   
        setLoading(false);
    }

    useEffect(() => {
        findMatch();
    }, [])

    return (
    <div>
        {
            loading ? (
                <div className='flex justify-center my-20'>
                    <ThreeDots />
                </div>
            ) : (
                <div className='flex flex-col items-center  my-32'>
                    <div className='flex flex-col items-center border 2 border-sky-400 rounded-xl w-44 p-8 px-24 mx-auto'>
                        <p className='text-3xl mb-5'>{currMatch.username ? `${currMatch.username}` : "nope"}</p>
                        <button className='text-3xl border-2 border-gray-600 rounded-md p-3' onClick={findMatch}>Search</button>
                    </div>
                    <button className='border-2 border-gray-600 rounded-md p-4 mt-5' onClick={handleRequest}>Send Request</button>
                </div>
            )
        }
    </div>
    )
}

export default MatchFinding