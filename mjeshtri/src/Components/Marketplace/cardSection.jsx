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
        <div className="flex items-center justify-center py-16 sm:py-24">
            <div className="flex flex-col items-center gap-4">
                <svg className="h-10 w-10 animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-sm text-gray-500">Loading experts...</p>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
            {experts.length > 0 ? (
                experts.map((expert) => (
                    <Link
                        key={expert.id}
                        to={`/Expert/${expert.id}`}
                        className="group block rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 overflow-hidden"
                    >
                        <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
                            <img
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                src={expert.profilePictureUrl || "https://via.placeholder.com/400x300"}
                                alt={expert.fullName}
                            />
                        </div>
                        <div className="p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h3 className="text-lg font-semibold text-gray-900 truncate">{expert.fullName}</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">{expert.category}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="text-base font-semibold text-blue-600">${expert.hourlyFee}</span>
                                    <span className="text-sm text-gray-500">/hr</span>
                                    <p className="text-xs text-gray-500 mt-1">{expert.jobsTaken ?? 0} jobs</p>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <svg className="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.39 2.418c-.785.57-1.84-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.604 9.393c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.966z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">{expert.averageRating ?? '—'}</span>
                                </div>
                                <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                                    View profile →
                                </span>
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 rounded-2xl bg-white border border-gray-200 text-center">
                    <svg className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900">No experts found</h3>
                    <p className="mt-1 text-sm text-gray-500 max-w-sm">Try adjusting your filters or reset to see more results.</p>
                </div>
            )}
        </div>
    );
}

export default CardSection;