import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const { VITE_API_BASE_URL } = import.meta.env;

const CardSection = ({ filters }) => {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${VITE_API_BASE_URL}/api/expert`, {
                    params: {
                        categories: filters.categories,
                        minPrice: filters.minPrice,
                        maxPrice: filters.maxPrice
                    }
                });
                setExperts(response.data);
            } catch (error) {
                console.error("Error fetching experts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperts();
    }, [filters]); 

    if (loading) return (
        <svg class="mx-auto size-8 animate-spin text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 lg:mx-10 xl:mx-32 mb-10">
            {experts.length > 0 ? (
                experts.map((expert) => (
                    <div key={expert.id} className="border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 transition-all hover:scale-[1.01] duration-600 cursor-pointer bg-white">
                        <img 
                            className="w-full h-48 object-cover" 
                            src={expert.profilePictureUrl || "https://via.placeholder.com/150"} 
                            alt={expert.fullName} 
                        />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-2">{expert.fullName}</h3>
                            <p className="text-gray-600 mb-4">{expert.category}</p>
                            <span className="text-blue-600 font-medium">${expert.hourlyFee} per hour</span>
                            
                            <Link 
                                to={`/expert/${expert.id}`} 
                                className="block rounded-sm p-2 mt-5 text-sm text-white bg-blue-600 text-center hover:underline"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                    No experts found matching these filters.
                </div>
            )}
        </div>
    );
}

export default CardSection;