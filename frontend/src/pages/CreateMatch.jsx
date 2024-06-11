import React, { useState, useEffect } from 'react'
import BackButton from '../components/BackButton'
import axios from 'axios';
import ThreeDots from 'react-loading-icons/dist/esm/components/three-dots';
import useRedirect from '../hooks/RedirectToLogin';
import { useUser } from '../components/UserContext';
import { useNavigate } from 'react-router-dom';

const CreateMatch = () => {
    const [loading, setLoading] = useState(false);
    const [contact, setContact] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const { user } = useUser();
    const navigate = useNavigate();
    
    useRedirect();

    const handleSaveMatch = async () => {
        if (!contact || ! date || !time) {
            return;
        }

        let newDate;

        try {
            newDate = new Date(date);
        } catch (error) {
            alert("Date entered not valid!");
            return;
        }

        try {
            newDate.setHours(parseInt(time.slice(0,2)));
            newDate.setMinutes(parseInt(time.slice(3,5)));
        } catch (error) {
            alert("Time entered not valid!");
            return;
        }

        console.log(newDate);
        console.log(newDate.getDate());

        setLoading(true);
        const data = {
            user1: user.username,
            user2: contact,
            date: newDate
        }

        try {
            await axios.post("http://localhost:1155/matches", data);
            setLoading(false);
            navigate("/home")
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    return (
    <div className='p-4'>
        <BackButton destination='/home' />
        {
            loading || !user ? (
                <div className='flex justify-center'>
                <ThreeDots fill="#000000" />
                </div>
            ) : (
                <div className='flex flex-col border 2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
                    <div className="my-4">
                    <label className='text-2xl mr-4 text-gray-500'>Proposer</label>
                    <input type='text' value={user.username} readOnly className='border-2 border-gray-500 px-4 py-2 w-full text-xl' />
                    <label className='text-2xl mr-4 text-gray-500'>Contact</label>
                    <input type='text' value={contact} onChange={(e) => setContact(e.target.value)} className='border-2 border-gray-500 px-4 py-2 w-full text-xl' />
                    <label className='text-2xl mr-4 text-gray-500'>Date</label>
                    <input type='text' placeholder='mm/dd/yyyy' value={date} onChange={(e) => setDate(e.target.value)} className='border-2 border-gray-500 px-4 py-2 w-full text-xl' />
                    <label className='text-2xl mr-4 text-gray-500'>Time</label>
                    <input type='text' placeholder='hh:mm' value={time} onChange={(e) => setTime(e.target.value)} className='border-2 border-gray-500 px-4 py-2 w-full text-xl' />
                    </div>
                    <button className='p-2 bg--sky-300 m-8 text-2xl'onClick={handleSaveMatch}>Save</button>
                </div>
            )
        }
    </div>
    )
}

export default CreateMatch