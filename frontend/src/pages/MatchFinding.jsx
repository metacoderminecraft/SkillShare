import axios from 'axios';
import React, { useCallback, useEffect } from 'react'
import ThreeDots from 'react-loading-icons/dist/esm/components/three-dots';
import { useState } from 'react';
import Modal from '../components/Modal';
import Dropdown from '../components/Dropdown'

const MatchFinding = () => {
    const [loading, setLoading] = useState(false);
    const [currSkill, setCurrSkill] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [skills, setSkills] = useState([])
    const [mySkill, setMySkill] = useState("")

    const handleRequest = async () => {
        if(!currSkill) {
            return;
        }

        setLoading(true);
        try {
            await axios.post("http://localhost:1155/matches/request", { requesterId: mySkill, recipientId: currSkill._id }, { withCredentials: true });
            setShowModal(false);
        } catch (error) {
            console.log(error);
        }

        setLoading(false);
    }

    const findMatch = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:1155/skills/search", { withCredentials: true });

            setCurrSkill(response.data.skill);
        } catch (error) {
            console.log(error);
        }   
        setLoading(false);
    }

        // Fetch skills only when needed (when showModal becomes true)
        useEffect(() => {
            if (showModal && !skills.length) {
                setLoading(true);
                axios.get('http://localhost:1155/skills/mySkills', { withCredentials: true })
                    .then(response => {
                        setSkills(response.data.skills);
                    })
                    .catch(error => console.log(error))
                    .finally(() => setLoading(false));
            }
        }, [showModal, skills.length]);
    
        const renderModal = useCallback(() => {
            if (skills.length == 0) {
                alert("you need a skill!");
                return;
            }

            const renderOptions = () => (
                <>
                    {skills.map(skill => (
                        <option key={skill._id} value={skill._id}>{skill.title}</option>
                    ))}
                </>
            );
    
            return (
                    <Modal render={() => (
                        <div>
                            <Dropdown
                                value={mySkill}
                                onChange={(value) => setMySkill(value)}
                                renderOptions={renderOptions}
                                className="flex flex-col w-24"
                            />
                            <button className='my-3' onClick={handleRequest}>Confirm</button>
                        </div>
                    )} onClose={() => setShowModal(false)} />
            );
        }, [skills, mySkill]);

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
                <div className='flex flex-col items-center'>
                    <div className='flex flex-col items-center border 2 border-sky-400 rounded-xl p-8 px-8 mx-auto'>
                        {
                            Object.keys(currSkill).length == 0 ? (
                                <div className='flex justify-center my-20'>
                                    <ThreeDots />
                                </div>
                            ) : (
                                <div className='p-3'>
                                    <p className='text-3xl mb-5'>{currSkill.user.username}</p>   
                                    <p className='text-3xl mb-5'>{currSkill.title}</p> 
                                    <p className='text-2xl mb-5'>{currSkill.focus}</p>   
                                    <p className='text-xl mb-5'>{currSkill.description}</p> 
                                </div>
 
                            )
                        }
                        <button className='text-3xl border-2 border-gray-600 rounded-md p-3' onClick={findMatch}>Search</button>
                    </div>
                    <button className='border-2 border-gray-600 rounded-md p-4 mt-5' onClick={() => setShowModal(true)}>Send Request</button>
                    {showModal && renderModal()}
                </div>
            )
        }
    </div>
    )
}

export default MatchFinding