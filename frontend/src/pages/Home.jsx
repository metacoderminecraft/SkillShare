import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ThreeDots } from 'react-loading-icons';
import { MdOutlineAddBox } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        setLoading(true);
        axios
        .get("http://localhost:1155/matches")
        .then((response) => {
            setMatches(response.data.data);
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
        })
    }, [])

    return (
        <div className='p-4'>
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl my-8'>Matches</h1>
                <Link to={"/matches/create"}>
                    <MdOutlineAddBox className='text-sky-800 text-4xl' />
                </Link>
            </div>
            {
                loading ? (
                    <div className='flex justify-center'>
                    <ThreeDots fill="#000000" />
                    </div>
                ) : (
                    <table className='w-full border-separate border-spacing-2'>
                        <thead>
                            <tr>
                                <th className='border border-slate-600 rounded-md'>#</th>
                                <th className='border border-slate-600 rounded-md'>Appointment Time</th>
                                <th className='border border-slate-600 rounded-md'>Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            {matches.map((match, index) => (
                                <tr key={match._id} className='h-8'>
                                    <td className='border border-slate-600 rounded-md text-center'>{index+1}</td>
                                    <td className='border border-slate-600 rounded-md text-center'>{match.date}</td>
                                    <td className='border border-slate-600 rounded-md text-center'>{match.user2}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            }
        </div>
    )
}

export default Home