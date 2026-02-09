import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';

const { VITE_API_BASE_URL } = import.meta.env;

const ExpertPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    
    // Status states
    const [expert, setExpert] = useState(null);
    const [bookingStatus, setBookingStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get(`${VITE_API_BASE_URL}/api/Expert/${id}`)
            .then(res => setExpert(res.data))
            .catch(err => console.error(err));
    }, [id]);

    const handleBookNow = async () => {

        setBookingStatus({ type: '', message: '' });

        const activeToken = user?.token;

        // 1. Check if logged in locally first
        if (!activeToken) {
            setBookingStatus({ 
                type: 'auth-error', 
                message: 'You must be logged in to book an expert.' 
            });
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${VITE_API_BASE_URL}/api/Booking/hire`, 
            { 
                expertId: parseInt(id), 
                description: `Booking request for ${expert.fullName}` 
            }, 
            {
                headers: { Authorization: `Bearer ${activeToken}` }
            });

            setBookingStatus({ 
                type: 'success', 
                message: 'Booking was created successfully! View it in your user panel.' 
            });
        } catch (err) {
            if (err.response?.status === 401) {
                setBookingStatus({ 
                    type: 'auth-error', 
                    message: 'Session expired. Please log in again.' 
                });
            } else {
                setBookingStatus({ 
                    type: 'error', 
                    message: err.response?.data || 'An error occurred. Please try again.' 
                });
            }
        } finally {
            setLoading(false);
        }
    };

    if (!expert) return <div className="text-center mt-20">Loading expert details...</div>;

    return (
        <div className="w-fit p-10 mx-auto bg-white shadow-lg rounded-xl m-10">
            <div className="flex flex-col md:flex-row justify-self-center space-y-4 text-center align-center ">
                <img src={expert.profilePictureUrl || "https://via.placeholder.com/150"} alt={expert.fullName} className="w-80 h-80 rounded-md object-cover" />
                <div className='p-8'>
                    <h1 className="text-3xl font-bold">{expert.fullName}</h1>
                    <p className="text-blue-600 font-semibold text-xl">{expert.category}</p>
                    <p className="mt-4 text-gray-700">{expert.bio || "No bio provided."}</p>
                    <p className='mt-4 text-gray-700'>Jobs Taken: {expert.jobsTaken}</p>
                    <p className='mt-4 text-gray-700'>Average rating: {expert.averageRating}</p>
                    
                    

                    {/* --- FEEDBACK MESSAGES SECTION --- */}
                    <div className="mt-4 min-h-[40px]">
                        {bookingStatus.type === 'success' && (
                            <p className="text-green-600 font-medium">{bookingStatus.message}</p>
                        )}

                        {bookingStatus.type === 'error' && (
                            <p className="text-red-600 font-medium">{bookingStatus.message}</p>
                        )}

                        {bookingStatus.type === 'auth-error' && (
                            <div className="text-red-600 font-medium">
                                <p>{bookingStatus.message}</p>
                                <div className="flex justify-center gap-2 mt-1">
                                    <Link to="/login" className="text-blue-600 underline hover:text-blue-800">Login</Link>
                                    <span>or</span>
                                    <Link to="/register" className="text-blue-600 underline hover:text-blue-800">Sign Up</Link>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex items-center space space-x-6 justify-center">
                        <span className="text-2xl font-bold">${expert.hourlyFee}/hr</span>
                        <button 
                            onClick={handleBookNow}
                            disabled={loading}
                            className={`${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white px-6 py-2 rounded-lg cursor-pointer transition-colors`}
                        >
                            {loading ? 'Processing...' : 'Book Now'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpertPage;