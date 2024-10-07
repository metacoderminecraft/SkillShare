import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ThreeDots from 'react-loading-icons/dist/esm/components/three-dots';
import Modal from '../components/Modal';
import Dropdown from '../components/Dropdown';

const MatchFinding = () => {
    const [loading, setLoading] = useState(false);
    const [currSkillIndex, setCurrSkillIndex] = useState(0);
    const [skillsHistory, setSkillsHistory] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [skills, setSkills] = useState([]);
    const [mySkill, setMySkill] = useState("");

    const handleRequest = async () => {
        if (!skillsHistory[currSkillIndex]) {
            return;
        }

        setLoading(true);
        try {
            await axios.post("http://localhost:1155/matches/request", {
                requesterId: mySkill,
                recipientId: skillsHistory[currSkillIndex]._id,
            }, { withCredentials: true });
            setShowModal(false);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const findMatch = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:1155/skills/search", { withCredentials: true });

            setSkillsHistory((prev) => [...prev, response.data.skill]);
            setCurrSkillIndex(skillsHistory.length); // Move to the latest skill
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const goToPreviousSkill = () => {
        if (currSkillIndex > 0) {
            setCurrSkillIndex(currSkillIndex - 1);
        }
    };

    const goToNextSkill = () => {
        if (currSkillIndex < skillsHistory.length - 1) {
            setCurrSkillIndex(currSkillIndex + 1);
        } else {
            findMatch(); // Fetch a new skill if at the end of history
        }
    };

    useEffect(() => {
        findMatch(); // Fetch the first skill on component mount
    }, []);

    useEffect(() => {
      setLoading(true);
      axios.get('http://localhost:1155/skills/mySkills', { withCredentials: true })
          .then(response => {
              setSkills(response.data.skills);
          })
          .catch(error => console.log(error))
          .finally(() => setLoading(false));
    }, []);

    const renderModal = useCallback(() => {
        if (skills.length === 0) {
            alert("You need a skill!");
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

    return (
        <div>
            {loading ? (
                <div className='flex justify-center my-20'>
                    <ThreeDots />
                </div>
            ) : (
                <div className='flex flex-col items-center'>
                    <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl p-8 px-8 mx-auto'>
                        {skillsHistory.length === 0 || currSkillIndex < 0 ? (
                            <div className='flex justify-center my-20'>
                                <ThreeDots />
                            </div>
                        ) : (
                            <div className='p-3'>
                                <p className='text-3xl mb-5'>{skillsHistory[currSkillIndex]?.user?.username}</p>
                                <p className='text-3xl mb-5'>{skillsHistory[currSkillIndex]?.title}</p>
                                <p className='text-2xl mb-5'>{skillsHistory[currSkillIndex]?.focus}</p>
                                <p className='text-xl mb-5'>{skillsHistory[currSkillIndex]?.description}</p>
                            </div>
                        )}
                        <div className='flex space-x-5'>
                            <button className='text-2xl border-2 border-gray-600 rounded-md p-1' onClick={goToPreviousSkill}>Previous Skill</button>
                            <button className='text-2xl border-2 border-gray-600 rounded-md p-1' onClick={goToNextSkill}>Next Skill</button>
                        </div>
                    </div>
                    <button className='border-2 border-gray-600 rounded-md p-4 mt-5' onClick={() => setShowModal(true)}>Send Request</button>
                    {showModal && renderModal()}
                </div>
            )}
        </div>
    );
};

export default MatchFinding;