import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ThreeDots } from 'react-loading-icons';
import { MdOutlineAddBox, MdCheck, MdClose } from 'react-icons/md';
import { Link } from 'react-router-dom';
import useRedirect from '../hooks/RedirectToLogin';
import { useUser } from '../components/UserContext';

const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [approvedRequests, setApprovedRequests] = useState([]);
    const { user } = useUser();

    async function fetchData() {
        if (!user) {
            return;
        }
        
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:1155/matches/myMatches`, { withCredentials: true });
            setOutgoingRequests(response.data.outgoing.map(match => (
                {
                    ...match,
                    dateObj: new Date(match.date)
                }
            )));
            setIncomingRequests(response.data.incoming.map(match => (
                {
                    ...match,
                    dateObj: new Date(match.date)
                }
            )));
            setApprovedRequests(response.data.approved.map(match => (
                {
                    ...match,
                    dateObj: new Date(match.date)
                }
            )));
            response.data.rejected.forEach(match => {
                alert(`${match.recipient.username} rejected your match request`);
            });
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [user])

    const handleApprove = async (matchId) => {
        try {
            await axios.post("http://localhost:1155/matches/approve", {matchId}, { withCredentials: true });
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    const handleReject = async (matchId) => {
        try {
            await axios.post("http://localhost:1155/matches/reject", {matchId}, { withCredentials: true });
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
        {
            loading || !user ? (
                <div className='flex justify-center my-20'>
                <ThreeDots fill="#000000" />
                </div>
            ) : (
                <div className='p-4 flex flex-col my-10'>
                    <div className='flex flex-col'>
                        <table className='w-full'>
                        <thead>
                            <tr>
                                <th className='text-3xl'>Outgoing</th>
                                <th className='text-3xl'>Incoming</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                <table className='w-full border-separate border-spacing-2'>
                            <thead>
                                <tr>
                                    <th className='border border-slate-600 rounded-md'>#</th>
                                    <th className='border border-slate-600 rounded-md'>Appointment Time</th>
                                    <th className='border border-slate-600 rounded-md'>Contact</th>
                                </tr>
                            </thead>
                            <tbody>
                                {outgoingRequests.map((match, index) => (
                                    <tr key={match._id} className='h-8'>
                                        <td className='border border-slate-600 rounded-md text-center'>{index+1}</td>
                                        <td className='border border-slate-600 rounded-md text-center'>{`${match.dateObj.getMonth() + 1}/${match.dateObj.getDate()}/${match.dateObj.getFullYear()} at ${match.dateObj.getHours()}:${match.dateObj.getMinutes().toString().padStart(2, '0')}`}</td>
                                        <td className='border border-slate-600 rounded-md text-center'>{match.recipient.username}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                                </td>
                                <td className='ml-10'>
                                <table className='w-full border-separate border-spacing-2'>
                            <thead>
                                <tr>
                                    <th className='border border-slate-600 rounded-md'>#</th>
                                    <th className='border border-slate-600 rounded-md'>Appointment Time</th>
                                    <th className='border border-slate-600 rounded-md'>Contact</th>
                                    <th className='border border-slate-600 rounded-md'>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {incomingRequests.map((match, index) => (
                                    <tr key={match._id} className='h-8'>
                                        <td className='border border-slate-600 rounded-md text-center'>{index+1}</td>
                                        <td className='border border-slate-600 rounded-md text-center'>{`${match.dateObj.getMonth() + 1}/${match.dateObj.getDate()}/${match.dateObj.getFullYear()} at ${match.dateObj.getHours()}:${match.dateObj.getMinutes().toString().padStart(2, '0')}`}</td>
                                        <td className='border border-slate-600 rounded-md text-center'>{match.requester.username}</td>
                                        <td className='flex border border-slate-600 rounded-md justify-center'>
                                            <button className='text-3xl text-green-400 mr-16' onClick={() => {handleApprove(match._id)}}>
                                                <MdCheck  />
                                            </button>
                                            <button className='text-3xl text-red-600' onClick={() => {handleReject(match._id)}}>
                                                <MdClose />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <h1 className='text-3xl text-center mt-20 mb-3'>Approved</h1>
                    <table className='w-full border-separate border-spacing-2'>
                        <thead>
                            <tr>
                                <th className='border border-slate-600 rounded-md'>#</th>
                                <th className='border border-slate-600 rounded-md'>Appointment Time</th>
                                <th className='border border-slate-600 rounded-md'>Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                user && approvedRequests.map((match, index) => (
                                    <tr key={match._id} className='h-8'>
                                        <td className='border border-slate-600 rounded-md text-center'>{index+1}</td>
                                        <td className='border border-slate-600 rounded-md text-center'>{`${match.dateObj.getMonth() + 1}/${match.dateObj.getDate()}/${match.dateObj.getFullYear()} at ${match.dateObj.getHours()}:${match.dateObj.getMinutes().toString().padStart(2, '0')}`}</td>
                                        <td className='border border-slate-600 rounded-md text-center'>{user._id == match.recipient._id ? `${match.requester.username}` : `${match.recipient.username}`}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    </div>
                </div>
            )
        }
        </div>
    )
}

export default Dashboard