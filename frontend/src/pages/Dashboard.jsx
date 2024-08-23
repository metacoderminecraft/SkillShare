import React, { useCallback } from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ThreeDots } from 'react-loading-icons';
import { useUser } from '../components/UserContext';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import { MdCheck, MdClose, MdChat, MdSend } from 'react-icons/md'

const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [incoming, setIncoming] = useState([])
    const [currIncoming, setCurrIncoming] = useState({})
    const [showIncoming, setShowIncoming] = useState(false)
    const [approved, setApproved] = useState([])
    const [currApproved, setCurrApproved] = useState({});
    const [showApproved, setShowApproved] = useState(false);
    const [currChat, setCurrChat] = useState({});
    const [showChat, setShowChat] = useState(false);
    const [currMessage, setCurrMessage] = useState('');
    const { user } = useUser();

    useEffect(() => {
        const fetchIncoming = async () => {
            setLoading(true)         
            const response = await axios.get("http://localhost:1155/matches/incoming", { withCredentials: true });
            setIncoming(response.data.incoming);
            setLoading(false)
        }

        fetchIncoming();
    }, [])

    const renderIncomingDisplay = useCallback(() => {
        return (
            <div className='flex flex-col items-start'>
            {incoming.map((request) => (
                <button key={request._id} onClick={() => {
                    setCurrIncoming(request);
                    setShowIncoming(true);
                }}>{request.requester.title}</button>
            ))}
            </div>
        );
    }, [incoming])

    const renderRequest = useCallback(() => {
        const render = () => (
            <div>
                <h1 className='font-semibold'>Offered Skill: {currIncoming.requester.title}</h1>
                <h2>requester: {currIncoming.requester.user.username}</h2>
                <p>focus: {currIncoming.requester.focus}</p>
                <p>description: {currIncoming.requester.description}</p>
                <p className='font-semibold'>Requested Skill: {currIncoming.recipient.title}</p>
                <br />
                <div className='flex justify-between'>
                    <MdCheck onClick={handleApprove} className='text-green-700 cursor-pointer'></MdCheck>
                    <MdClose onClick={handleReject} className='text-red-600 cursor-pointer'></MdClose>
                </div>
            </div>

        )

        return (
            <Modal render={render} onClose={() => setShowIncoming(false)} />
        )
    }, [currIncoming, showIncoming])

    const handleReject = async () => {
        setLoading(true)
        try {
            await axios.post("http://localhost:1155/matches/reject", { matchId: currIncoming._id }, { withCredentials: true })
            window.location.reload();
        } catch (error) {
            console.log(error);
            alert("failure");
        }
        setLoading(false)
    }

    const handleApprove = async () => {
        setLoading(true)
        try {
            await axios.post("http://localhost:1155/matches/approve", { matchId: currIncoming._id }, { withCredentials: true })
            window.location.reload();
        } catch (error) {
            console.log(error);
            alert("failure");
        }
        setLoading(false)
    }

    useEffect(() => {
        const fetchApproved = async () => {
            setLoading(true)
            const response = await axios.get('http://localhost:1155/matches/approved', { withCredentials: true });
            setApproved(response.data.approved);
            setLoading(false)
        }

        fetchApproved();
    }, [])

    const renderApprovedDisplay = useCallback(() => {
        return (
            <div className='flex flex-col items-start'>
            {approved.map((request) => (
                <button key={request._id} onClick={() => {
                    setCurrApproved(request);
                    setShowApproved(true);
                }}>{request.requester.title}</button>
            ))}
            </div>
        );
    }, [approved]);

    const renderApproved = useCallback(() => {
        const render = () => (
            <div>
                <h1 className='font-semibold'>Offered Skill: {currApproved.requester.title}</h1>
                <h2>requester: {currApproved.requester.user.username}</h2>
                <p>focus: {currApproved.requester.focus}</p>
                <p>description: {currApproved.requester.description}</p>
                <p className='font-semibold'>Requested Skill: {currApproved.recipient.title}</p>
                <br />
                <div className='flex justify-center items-center'>
                    <MdChat onClick={() => {
                        setShowApproved(false);
                        setShowIncoming(false);
                        setShowChat(true);
                    }} className='cursor-pointer' />
                </div>
            </div>

        )

        return (
            <Modal render={render} onClose={() => setShowApproved(false)} />
        )
    }, [currApproved, setCurrApproved])

    useEffect(() => {
        if (!showChat) {
            return;
        }

        const fetchChat = async () => {
            setLoading(true)
            const recieverId = currApproved.requester.user._id == user._id ? currApproved.recipient.user._id : currApproved.requester.user._id;
            try {
                const response = await axios.post("http://localhost:1155/chatting/confirm", { recieverId, matchId: currApproved._id }, { withCredentials: true })
                setCurrChat(response.data.chat);
            } catch (error) {
                console.log(error);
                alert('error');
            }
            setLoading(false)
        }

        fetchChat();
    }, [showChat])

    const renderChat = useCallback(() => {
        if (Object.keys(currChat) == 0) {
            return;
        }

        const render = () => (
            <div>
                {currChat.messages.map((message) => (
                    <div key={message._id} className={message.sender == user.username ? 'text-end' : 'text-start'}>
                        <div className='m-4'>
                            <h1 className='font-semibold'>{message.sender}</h1>
                            <p>{message.message}</p>
                        </div>
                    </div>
                    ))}
                <div className='flex items-center justify-between'>
                    <input
                        type="text"
                        placeholder="Type your message here"
                        value={currMessage}
                        onChange={(e) => setCurrMessage(e.target.value)}
                        className="border-2 border-black rounded-md my-2 p-1 w-full"
                    />
                    <MdSend onClick={handleSend}  className='text-2xl ml-2 cursor-pointer' />
                </div>
            </div>  
        )

        return (
            <Modal render={render} onClose={() => {
                setShowChat(false);
                setShowApproved(true);
                setCurrMessage('');
            }} />
        )
    }, [showChat, currChat, currMessage])

    const handleSend = async () => {
        if (!currMessage || !currChat) {
            return;
        }
        
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:1155/chatting/send', { message: currMessage, chatId: currChat._id }, { withCredentials: true });
            setCurrChat(response.data.chat);
            setCurrMessage('');
        } catch (error) {
            console.log(error);
            alert('error');
        }
        setLoading(false);
    }

    return (
        <div>
            {
                loading || !user ? (
                    <div className='flex justify-center my-20'>
                        <ThreeDots fill="#000000" />
                    </div>
                ) : (
                    <div className='flex justify-between'>
                        <Sidebar title="Incoming" renderDisplay={renderIncomingDisplay} />
                        {showIncoming && renderRequest()}
                        <Sidebar title="Approved" renderDisplay={renderApprovedDisplay} />
                        {showApproved && renderApproved()}
                        {showChat && renderChat()}
                    </div>
                )
            }
        </div>
    )
}
export default Dashboard