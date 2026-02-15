import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';

const { VITE_API_BASE_URL } = import.meta.env;

const ExpertPage = () => {
    const { id } = useParams();
    const { user } = useAuth();

    const [expert, setExpert] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [bookingStatus, setBookingStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get(`${VITE_API_BASE_URL}/api/Expert/${id}`);
                setExpert(res.data);
            } catch (err) {
                console.error(err);
            }

            try {
                const rev = await axios.get(`${VITE_API_BASE_URL}/api/booking/expert-reviews/${id}`);
                setReviews(Array.isArray(rev.data) ? rev.data : rev.data.reviews || []);
            } catch (err) {
                setReviews([]);
            }
        };

        fetch();
    }, [id]);

    const handleBookNow = async () => {
        setBookingStatus({ type: '', message: '' });

        const activeToken = user?.token || localStorage.getItem('token');

        if (!activeToken) {
            setBookingStatus({
                type: 'auth-error',
                message: 'You must be logged in to book an expert.',
            });
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                `${VITE_API_BASE_URL}/api/Booking/hire`,
                {
                    expertId: parseInt(id),
                    description: `Booking request for ${expert.fullName}`,
                },
                {
                    headers: { Authorization: `Bearer ${activeToken}` },
                }
            );

            setBookingStatus({
                type: 'success',
                message: 'Booking was created successfully! View it in your user panel.',
            });
        } catch (err) {
            if (err.response?.status === 401) {
                setBookingStatus({
                    type: 'auth-error',
                    message: 'Session expired. Please log in again.',
                });
            } else {
                setBookingStatus({
                    type: 'error',
                    message: err.response?.data || 'An error occurred. Please try again.',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    if (!expert)
        return (
            <div className="min-h-[50vh] flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <svg className="h-10 w-10 animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-gray-600">Loading expert details...</p>
                </div>
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="sm:flex">
                        <div className="sm:w-2/5 flex-shrink-0 bg-gray-50 flex items-center justify-center p-6 sm:p-8">
                            <img
                                src={expert.profilePictureUrl || 'https://via.placeholder.com/300'}
                                alt={expert.fullName}
                                className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl object-cover shadow-md"
                            />
                        </div>
                        <div className="flex-1 p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{expert.fullName}</h1>
                                    <p className="mt-1 text-sm font-medium text-blue-600">{expert.category}</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 sm:gap-6 sm:text-right">
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">${expert.hourlyFee}</p>
                                        <p className="text-sm text-gray-500">per hour</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.39 2.418c-.785.57-1.84-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.604 9.393c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.966z" />
                                        </svg>
                                        <span className="text-sm font-semibold text-gray-900">{expert.averageRating ?? '—'}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">{expert.jobsTaken ?? 0} jobs completed</p>
                                </div>
                            </div>

                            <p className="mt-5 text-gray-700 leading-relaxed">{expert.bio || 'No bio provided.'}</p>

                            <div className="mt-6 space-y-3">
                                {bookingStatus.type === 'success' && (
                                    <p className="text-sm font-medium text-green-700 bg-green-50 px-4 py-3 rounded-lg border border-green-200">
                                        {bookingStatus.message}
                                    </p>
                                )}
                                {bookingStatus.type === 'error' && (
                                    <p className="text-sm font-medium text-red-700 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
                                        {bookingStatus.message}
                                    </p>
                                )}
                                {bookingStatus.type === 'auth-error' && (
                                    <div className="text-sm font-medium text-red-700 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
                                        <p>{bookingStatus.message}</p>
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium underline">
                                                Log in
                                            </Link>
                                            <span className="text-gray-500">or</span>
                                            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium underline">
                                                Sign up
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6">
                                <button
                                    onClick={handleBookNow}
                                    disabled={loading}
                                    className={`inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                        loading
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    {loading ? 'Processing...' : 'Book now'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 bg-gray-50/50 px-6 sm:px-8 py-6 sm:py-8">
                        <h3 className="text-lg font-semibold text-gray-900">Client reviews</h3>
                        {reviews.length === 0 ? (
                            <p className="mt-3 text-gray-500 text-sm">No reviews yet.</p>
                        ) : (
                            <ul className="mt-4 space-y-4">
                                {reviews.map((r) => (
                                    <li
                                        key={r.bookingId || r.id}
                                        className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-sm font-medium text-gray-900">
                                                {r.clientName || `Client #${r.clientId}`}
                                            </span>
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <svg className="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.39 2.418c-.785.57-1.84-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.604 9.393c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.966z" />
                                                </svg>
                                                <span className="text-sm font-semibold text-gray-700">{r.rating}/10</span>
                                            </div>
                                        </div>
                                        {r.reviewComment && (
                                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">{r.reviewComment}</p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpertPage;
