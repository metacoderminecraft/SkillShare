import React, { useState, useEffect } from 'react';
import BackButton from "../components/BackButton";
import { useUser } from '../components/UserContext';
import ThreeDots from 'react-loading-icons/dist/esm/components/three-dots';
import useRedirect from '../hooks/RedirectToLogin';
import axios from 'axios';

const CreateSkill = () => {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [focus, setFocus] = useState("");
    const [description, setDescription] = useState("");
    const { user } = useUser();

    useRedirect();

    const handleSaveSkill = async () => {
        if (!title || !focus || !description) {
            alert("Enter all fields");
            return;
        }

        setLoading(true);
        try {
            await axios.post("http://localhost:1155/skills/create", { title, description, focus }, { withCredentials: true });
            setTitle("");
            setFocus("");
            setDescription("");
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    const renderForm = () => {
        if (focus == "") {
            return (
                <>
                    <option value=""></option>
                    <option value="tech">Tech</option>
                    <option value="art">Art</option>
                    <option value="wellness">Wellness</option>
                    <option value="sports">Sports</option>
                </>
            )
        }

        return (
            <>
                <option value="tech">Tech</option>
                <option value="art">Art</option>
                <option value="wellness">Wellness</option>
                <option value="sports">Sports</option>
            </>
        )
    }

  return (
    <div className='p-4'>
        <BackButton />
        {
            loading || !user ? (
                <div className='flex justify-center'>
                    <ThreeDots fill="#000000" />
                </div>
            ) : (
                <div className='flex flex-col border 2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
                    <div className="my-4 flex flex-col">
                        <label className='text-2xl mr-4 text-gray-500'>Title</label>
                        <input type='text' maxLength="25" value={title} onChange={(e) => setTitle(e.target.value)} className='border-2 border-gray-500 px-4 py-2 w-full text-xl mb-4' />
                        <label className='text-2xl mr-4 text-gray-500'>Focus</label>
                        <select value={focus} onChange={(e) => setFocus(e.target.value)} className='text-2xl mr-4 text-gray-500 border-2 border-slate-600 rounded-md mb-4 w-36'>
                            {renderForm()}
                        </select>
                        <label className='text-2xl mr-4 text-gray-500'>Description</label>
                        <textarea type='text' maxLength="500" rows="6" value={description} onChange={(e) => setDescription(e.target.value)} className='border-2 border-gray-500 px-4 py-2 w-full text-xl' />
                    </div>
                    <button className='p-2 bg--sky-300 m-8 text-2xl'onClick={handleSaveSkill}>Save</button>
                </div>
            )
        }
    </div>
  )
}

export default CreateSkill