import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ThreeDots from 'react-loading-icons/dist/esm/components/three-dots';
import axios from 'axios';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const { username } = useParams();
    const [loading, setLoading] = useState(false);
    const [isReal, setIsReal] = useState(false);
    const [skills, setSkills] = useState([]);
    const [skill, setSkill] = useState({});
    const [showSkill, setShowSkill] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            setLoading(true);
            try {
                await axios.get(`http://localhost:1155/users/${username}`);
                setIsReal(true);
                const response = await axios.get(`http://localhost:1155/skills/${username}`);
                setSkills(response.data.skills);
            } catch (error) {
                if (error.status != 404) {
                    console.log(error);
                }
            }
            setLoading(false);
        }

        checkUser();
    }, [username])

    const renderSkill = useCallback(() => {
        const render = () => (
            <div>
                <h1 className='font-semibold'>Skill: {skill.title}</h1>
                <p>focus: {skill.focus}</p>
                <p>description: {skill.description}</p>
            </div>
        )

        return (
            <Modal render={render} onClose={() => setShowSkill(false)} />
        )
    }, [showSkill, skill])

    return (
        <div>
        {loading ? (
                <div className='flex justify-center my-20'>
                <ThreeDots />
                </div>
            ) : (
                !isReal ? (
                    <div className='flex flex-col justify-center items-center h-screen'>
                        <h1 className='text-3xl mb-5'>404</h1>
                        <h1>User {username} not found</h1>
                    </div>
                ): (
                    <div className='flex flex-col justify-center items-center w-screen h-screen'>
                        <h1 className=' text-9xl'>{username}</h1>
                        <div className="grid grid-flow-row auto-rows-max gap-4 justify-start w-[850px] m-40" style={{ gridTemplateColumns: 'repeat(auto-fill, 200px)' }}>
                            {
                                skills.map((skill) => (
                                    <p key={skill._id} onClick={() => {
                                        setSkill(skill);
                                        setShowSkill(true);
                                    }}  className='border-2 rounded-lg p-2 cursor-pointer text-center'>{skill.title}</p>
                                ))
                            }
                            {showSkill && renderSkill()}
                        </div>
                        <button onClick={() => navigate("../home")} className='border-2 rounded-md text-blue-600 p-2'>Home</button>
                    </div>
                )
            )}
        </div>
    )
}

export default ProfilePage