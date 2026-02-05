import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const { VITE_API_BASE_URL } = import.meta.env;

const ExpertPage = () => {
    const { id } = useParams(); 
    const [expert, setExpert] = useState(null);

    useEffect(() => {
        axios.get(`${VITE_API_BASE_URL}/api/Expert/${id}`)
            .then(res => setExpert(res.data))
            .catch(err => console.error(err));
    }, [id]);

    if (!expert) return <div className="text-center mt-20">Loading expert details...</div>;

    return (
        <div className="w-fit mx-auto bg-white shadow-lg rounded-xl m-10">
            <div className="flex flex-col md:flex-col justify-self-center space-y-4 text-center align-center">
                <img src={expert.profilePictureUrl || "https://via.placeholder.com/150"} alt={expert.fullName} className="w-auto h-80 rounded-md object-cover" />
                <div className='p-8'>
                    <h1 className="text-3xl font-bold">{expert.fullName}</h1>
                    <p className="text-blue-600 font-semibold text-xl">{expert.category}</p>
                    <p className="mt-4 text-gray-700">{expert.bio || "No bio provided."}</p>
                    <p className='mt-4 text-gray-700'>Average rating: {expert.averageRating}</p>
                    <div className="mt-6 flex items-center space space-x-6 justify-center">
                        <span className="text-2xl font-bold">${expert.hourlyFee}/hr</span>
                        <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 cursor-pointer">
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpertPage;