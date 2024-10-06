import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThreeDots } from 'react-loading-icons';
import { MdCheck, MdClose } from 'react-icons/md';
import useRedirect from '../hooks/RedirectToLogin';
import { useUser } from '../components/UserContext';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [outgoing, setOutgoing] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [approved, setApproved] = useState([]);
  const { user } = useUser();

  async function fetchData() {
    if (!user) {
      return;
    }

    setLoading(true);
    try {
      const fetchIncoming = async () => {
        setLoading(true)

        const responseIn = await axios.get("http://localhost:1155/matches/incoming", { withCredentials: true });
        setIncoming(responseIn.data.incoming);
        
        const responseOut = await axios.get("http://localhost:1155/matches/outgoing", { withCredentials: true });
        setOutgoing(responseOut.data.outgoing);

        const responseApp = await axios.get("http://localhost:1155/matches/approved", { withCredentials: true });
        setApproved(responseApp.data.approved);

        const responseReject = await axios.get("http://localhost:1155/matches/rejected", { withCredentials: true });
        responseReject.data.rejected.forEach((match) => {
          alert(`${match.recipient.username} rejected your request`);
        })
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    }

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleApprove = async (matchId) => {
    try {
      await axios.post(
        'http://localhost:1155/matches/approve',
        { matchId },
        { withCredentials: true }
      );
      fetchData(); // Refresh data without reloading the page
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async (matchId) => {
    try {
      await axios.post(
        'http://localhost:1155/matches/reject',
        { matchId },
        { withCredentials: true }
      );
      fetchData(); // Refresh data without reloading the page
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='min-h-screen bg-background p-4'>
      {loading || !user ? (
        <div className='flex justify-center my-20'>
          <ThreeDots fill='#7E60BF' />
        </div>
      ) : (
        <div className='max-w-5xl mx-auto'>
          <h1 className='text-3xl font-semibold text-gray-800 text-center mb-8'>
            Dashboard
          </h1>

          {/* Outgoing and Incoming Requests */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {/* Outgoing Requests */}
            <div>
              <h2 className='text-2xl font-semibold text-gray-800 mb-4 text-center'>
                Outgoing Requests
              </h2>
              <div className='bg-white shadow-md rounded-lg overflow-hidden'>
                <table className='min-w-full'>
                  <thead className='bg-primary text-white'>
                    <tr>
                      <th className='px-4 py-2 text-left'>#</th>
                      <th className='px-4 py-2 text-left'>Appointment Time</th>
                      <th className='px-4 py-2 text-left'>Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outgoing.length > 0 ? (
                      outgoing.map((match, index) => (
                        <tr key={match._id} className='border-b'>
                          <td className='px-4 py-2'>{index + 1}</td>
                          <td className='px-4 py-2'>
                            {`${match.dateObj.toLocaleDateString()} at ${match.dateObj.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}`}
                          </td>
                          <td className='px-4 py-2'>{match.recipient.username}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className='px-4 py-2' colSpan='3'>
                          No outgoing requests.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Incoming Requests */}
            <div>
              <h2 className='text-2xl font-semibold text-gray-800 mb-4 text-center'>
                Incoming Requests
              </h2>
              <div className='bg-white shadow-md rounded-lg overflow-hidden'>
                <table className='min-w-full'>
                  <thead className='bg-primary text-white'>
                    <tr>
                      <th className='px-4 py-2 text-left'>#</th>
                      <th className='px-4 py-2 text-left'>Appointment Time</th>
                      <th className='px-4 py-2 text-left'>Contact</th>
                      <th className='px-4 py-2 text-center'>Options</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incoming.length > 0 ? (
                      incoming.map((match, index) => (
                        <tr key={match._id} className='border-b'>
                          <td className='px-4 py-2'>{index + 1}</td>
                          <td className='px-4 py-2'>
                            {`${match.dateObj.toLocaleDateString()} at ${match.dateObj.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}`}
                          </td>
                          <td className='px-4 py-2'>{match.requester.username}</td>
                          <td className='px-4 py-2 flex justify-center space-x-4'>
                            <button
                              className='text-green-500 hover:text-green-600 transition duration-200'
                              onClick={() => handleApprove(match._id)}
                              aria-label='Approve'
                            >
                              <MdCheck size={24} />
                            </button>
                            <button
                              className='text-red-500 hover:text-red-600 transition duration-200'
                              onClick={() => handleReject(match._id)}
                              aria-label='Reject'
                            >
                              <MdClose size={24} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className='px-4 py-2' colSpan='4'>
                          No incoming requests.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Approved Requests */}
          <div className='mt-12'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4 text-center'>
              Approved Requests
            </h2>
            <div className='bg-white shadow-md rounded-lg overflow-hidden'>
              <table className='min-w-full'>
                <thead className='bg-primary text-white'>
                  <tr>
                    <th className='px-4 py-2 text-left'>#</th>
                    <th className='px-4 py-2 text-left'>Appointment Time</th>
                    <th className='px-4 py-2 text-left'>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {approved.length > 0 ? (
                    approved.map((match, index) => (
                      <tr key={match._id} className='border-b'>
                        <td className='px-4 py-2'>{index + 1}</td>
                        <td className='px-4 py-2'>
                          {`${match.dateObj.toLocaleDateString()} at ${match.dateObj.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}`}
                        </td>
                        <td className='px-4 py-2'>
                          {user._id === match.recipient._id
                            ? match.requester.username
                            : match.recipient.username}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className='px-4 py-2' colSpan='3'>
                        No approved requests.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;