import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ThreeDots } from 'react-loading-icons';

const MatchFinding = () => {
    const [loading, setLoading] = useState(false);
    const [currMatch, setCurrMatch] = useState({});

    const handleRequest = async () => {
        if (!currMatch) {
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                "http://localhost:1155/matches/request",
                { recipient: currMatch.username, date: new Date() },
                { withCredentials: true }
            );
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const findMatch = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:1155/users/match", { withCredentials: true });
            setCurrMatch(response.data.user);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        findMatch();
    }, []);

    return (
        <div>
            {loading ? (
                <div className='flex justify-center my-20'>
                    <ThreeDots fill="#0A66C2" />
                </div>
            ) : (
                <div className='flex flex-col items-center my-32'>
                    <div className='flex flex-col items-center border-2 border-gray-300 rounded-xl w-80 p-8 mx-auto shadow-md'>
                        <p className='text-2xl font-semibold text-gray-800 mb-5'>
                            {currMatch.username ? `${currMatch.username}` : "No match found"}
                        </p>
                        <button
                            className='w-full text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2'
                            onClick={findMatch}
                        >
                            Search
                        </button>
                    </div>
                    <button
                        className='w-80 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 mt-5'
                        onClick={handleRequest}
                    >
                        Send Request
                    </button>
                </div>
            )}
        </div>
    );
};

export default MatchFinding;