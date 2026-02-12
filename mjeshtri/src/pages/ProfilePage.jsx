import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import {
    getCurrentUserProfile,
    updateCurrentUserProfile,
    getMyBookings,
    cancelBooking,
    updateBookingStatus,
} from "../userService";
import { Link } from "react-router-dom";

const ProfilePage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");

    const [profile, setProfile] = useState({
        fullName: "",
        email: "",
        phone: "",
    });
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [profileMessage, setProfileMessage] = useState(null);

    const [bookings, setBookings] = useState([]);
    const [isLoadingBookings, setIsLoadingBookings] = useState(false);
    const [bookingsError, setBookingsError] = useState(null);
    const [cancellingBookingId, setCancellingBookingId] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!user) return;

        const fetchProfile = async () => {
            setIsLoadingProfile(true);
            setProfileMessage(null);
            try {
                const data = await getCurrentUserProfile();
                setProfile({
                    fullName: data.fullName || user.fullName || "",
                    email: data.email || user.email || ""
                });
            } catch (error) {
                setProfileMessage("We couldn't load your profile. Please try again later.");
                // Fallback to minimal info from auth if API fails
                setProfile((prev) => ({
                    ...prev,
                    fullName: user.fullName || prev.fullName,
                }));
            } finally {
                setIsLoadingProfile(false);
            }
        };

        fetchProfile();
    }, [user]);

    useEffect(() => {
        if (!user || activeTab !== "dashboard") return;

        const fetchBookings = async () => {
            setIsLoadingBookings(true);
            setBookingsError(null);
            try {
                const data = await getMyBookings();
                setBookings(Array.isArray(data) ? data : data.bookings || []);
            } catch (error) {
                setBookingsError("We couldn't load your bookings. Please try again later.");
            } finally {
                setIsLoadingBookings(false);
            }
        };

        fetchBookings();
    }, [user, activeTab]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSavingProfile(true);
        setProfileMessage(null);
        try {
            await updateCurrentUserProfile(profile);
            setProfileMessage("Profile updated successfully.");
        } catch (error) {
            setProfileMessage("There was a problem saving your profile.");
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
            return;
        }

        setCancellingBookingId(bookingId);
        try {
            await cancelBooking(bookingId);
            setBookings((prev) => prev.filter((b) => b.id !== bookingId));
            setBookingsError(null);
            setIsModalOpen(false);
            setSelectedBooking(null);
        } catch (error) {
            setBookingsError("Failed to cancel booking. Please try again.");
        } finally {
            setCancellingBookingId(null);
        }
    };

    const openBookingModal = (booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const closeBookingModal = () => {
        setIsModalOpen(false);
        setSelectedBooking(null);
    };

    const handleChangeBookingStatus = async (bookingId, newStatus) => {
        // For expert actions: Accept -> Accepted, Accepted -> Finished, or Canceled
        try {
            await updateBookingStatus(bookingId, newStatus);
            setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)));
            if (selectedBooking && selectedBooking.id === bookingId) {
                setSelectedBooking((s) => ({ ...s, status: newStatus }));
            }
        } catch (error) {
            setBookingsError("Failed to update booking status. Please try again.");
        }
    };

    if (!user) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-16">
                <div className="max-w-md rounded-2xl bg-white p-8 shadow-lg">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                        You’re not logged in
                    </h1>
                    <p className="text-sm text-gray-600 mb-6">
                        Please sign in to view and manage your profile and bookings.
                    </p>
                    <div className="flex gap-3">
                        <Link
                            to="/login"
                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Go to login
                        </Link>
                        <Link
                            to="/register"
                            className="inline-flex w-full justify-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
                        >
                            Create account
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-5xl flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 lg:flex-row lg:p-8">
                {/* Left navigation */}
                <aside className="w-full border-b border-gray-100 pb-4 lg:w-1/4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
                    <div className="mb-6">
                        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                            Account
                        </p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                            {user.fullName || "Your profile"}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            Manage your personal information and see your bookings.
                        </p>
                    </div>

                    <nav className="space-y-1">
                        <button
                            type="button"
                            onClick={() => setActiveTab("profile")}
                            className={`flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium ${activeTab === "profile"
                                ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100"
                                : "text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                                P
                            </span>
                            Profile
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab("dashboard")}
                            className={`flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium ${activeTab === "dashboard"
                                ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100"
                                : "text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                                D
                            </span>
                            My bookings
                        </button>
                    </nav>
                </aside>

                {/* Right content */}
                <section className="w-full lg:w-3/4 lg:pl-6">
                    {activeTab === "profile" ? (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Profile information
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Update your details so experts can reach you more easily.
                            </p>

                            <form
                                onSubmit={handleProfileSubmit}
                                className="mt-6 space-y-5"
                            >
                                <div>
                                    <label
                                        htmlFor="fullName"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Full name
                                    </label>
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        value={profile.fullName}
                                        onChange={handleProfileChange}
                                        className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        disabled={isLoadingProfile}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={profile.email}
                                        onChange={handleProfileChange}
                                        className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        disabled={isLoadingProfile}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Phone number
                                    </label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={profile.phone}
                                        onChange={handleProfileChange}
                                        className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        disabled={isLoadingProfile}
                                    />
                                </div>

                                {profileMessage && (
                                    <p className="text-sm text-gray-600">{profileMessage}</p>
                                )}

                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={isSavingProfile}
                                        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {isSavingProfile ? "Saving..." : "Save changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Your bookings
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Here you can see all the bookings you&apos;ve made with experts.
                            </p>

                            <div className="mt-6">
                                {isLoadingBookings ? (
                                    <p className="text-sm text-gray-500">Loading your bookings...</p>
                                ) : bookingsError ? (
                                    <p className="text-sm text-red-600">{bookingsError}</p>
                                ) : bookings.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                                        You don&apos;t have any bookings yet.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        {/* Pending Column */}
                                        <div>
                                            <h4 className="mb-3 text-sm font-semibold text-gray-700">Pending <span className="text-xs font-medium text-gray-500">({bookings.filter((b) => b.status === "Pending").length})</span></h4>
                                            <div className="space-y-3">
                                                {bookings
                                                    .filter((b) => b.status === "Pending")
                                                    .map((booking) => (
                                                        <div
                                                            key={booking.id}
                                                            onClick={() => openBookingModal(booking)}
                                                            className="relative cursor-pointer rounded-xl border px-4 py-3 shadow-sm transition-all hover:shadow-md hover:border-indigo-200 bg-white border-gray-100"
                                                        >
                                                            <div className="pr-10">
                                                                <p className="font-medium text-gray-900">Booking #{booking.id}</p>
                                                                <p className="text-xs text-gray-500">{booking.requestedAt ? new Date(booking.requestedAt).toLocaleString() : "TBD"}</p>
                                                                <p className="text-xs text-gray-500 mt-1">{user?.role === "Expert" ? (booking.ClientName || booking.clientName || `Client #${booking.clientId}`) : (booking.ExpertName || booking.expertName || `Expert #${booking.expertId}`)}</p>
                                                            </div>

                                                            {/* status badge top-right */}
                                                            <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">{booking.status}</span>

                                                            {/* footer with cancel (bottom-right) */}
                                                            <div className="mt-4 flex justify-end gap-2">
                                                                {user?.role === "Expert" ? (
                                                                    <>
                                                                        <button
                                                                            onClick={(e) => { e.stopPropagation(); handleChangeBookingStatus(booking.id, "Accepted"); }}
                                                                            className="inline-flex items-center rounded-md bg-yellow-500 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-yellow-400"
                                                                        >
                                                                            Accept
                                                                        </button>
                                                                        <button
                                                                            onClick={(e) => { e.stopPropagation(); handleChangeBookingStatus(booking.id, "Canceled"); }}
                                                                            disabled={cancellingBookingId === booking.id}
                                                                            className="inline-flex items-center rounded-md bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
                                                                        >
                                                                            {cancellingBookingId === booking.id ? "Cancelling..." : "Cancel"}
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); handleCancelBooking(booking.id); }}
                                                                        disabled={cancellingBookingId === booking.id}
                                                                        className="inline-flex items-center rounded-md bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
                                                                    >
                                                                        {cancellingBookingId === booking.id ? "Cancelling..." : "Cancel"}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>

                                        {/* Accepted Column */}
                                        <div>
                                            <h4 className="mb-3 text-sm font-semibold text-gray-700">Accepted <span className="text-xs font-medium text-gray-500">({bookings.filter((b) => b.status === "Accepted").length})</span></h4>
                                            <div className="space-y-3">
                                                {bookings
                                                    .filter((b) => b.status === "Accepted")
                                                    .map((booking) => (
                                                        <div
                                                            key={booking.id}
                                                            onClick={() => openBookingModal(booking)}
                                                            className="relative cursor-pointer rounded-xl border px-4 py-3 shadow-sm transition-all hover:shadow-md hover:border-yellow-300 bg-yellow-50 border-yellow-100"
                                                        >
                                                            <div className="pr-10">
                                                                <p className="font-medium text-yellow-800">Booking #{booking.id}</p>
                                                                <p className="text-xs text-yellow-700">{booking.requestedAt ? new Date(booking.requestedAt).toLocaleString() : "TBD"}</p>
                                                                <p className="text-xs text-yellow-700 mt-1">{user?.role === "Expert" ? (booking.ClientName || booking.clientName || `Client #${booking.clientId}`) : (booking.ExpertName || booking.expertName || `Expert #${booking.expertId}`)}</p>
                                                            </div>

                                                            <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">{booking.status}</span>

                                                            <div className="mt-4 flex justify-end">
                                                                {user?.role === "Expert" && booking.status === "Accepted" && (
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); handleChangeBookingStatus(booking.id, "Finished"); }}
                                                                        className="inline-flex items-center rounded-md bg-green-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-green-500"
                                                                    >
                                                                        Mark Finished
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>

                                        {/* Finished Column */}
                                        <div>
                                            <h4 className="mb-3 text-sm font-semibold text-gray-700">Finished <span className="text-xs font-medium text-gray-500">({bookings.filter((b) => b.status === "Finished").length})</span></h4>
                                            <div className="space-y-3">
                                                {bookings
                                                    .filter((b) => b.status === "Finished")
                                                    .map((booking) => (
                                                        <div
                                                            key={booking.id}
                                                            onClick={() => openBookingModal(booking)}
                                                            className="relative cursor-pointer rounded-xl border px-4 py-3 shadow-sm transition-all hover:shadow-md hover:border-green-300 bg-green-50 border-green-100"
                                                        >
                                                            <div className="pr-10">
                                                                <p className="font-medium text-green-800">Booking #{booking.id}</p>
                                                                <p className="text-xs text-green-700">{booking.requestedAt ? new Date(booking.requestedAt).toLocaleString() : "TBD"}</p>
                                                                <p className="text-xs text-green-700 mt-1">{user?.role === "Expert" ? (booking.ClientName || booking.clientName || `Client #${booking.clientId}`) : (booking.ExpertName || booking.expertName || `Expert #${booking.expertId}`)}</p>
                                                            </div>

                                                            <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">{booking.status}</span>
                                                            {booking.rating && <span className="absolute left-3 bottom-3 text-sm font-semibold text-gray-900">★ {booking.rating}</span>}
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </section>
            </div>

            {/* Booking Details Modal */}
            {isModalOpen && selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="max-w-2xl w-full rounded-2xl bg-white shadow-xl">
                        {/* Modal Header */}
                        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Booking Details
                            </h3>
                            <button
                                onClick={closeBookingModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="px-6 py-6 space-y-6">
                            {/* Booking ID and Role */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Booking ID
                                    </label>
                                    <p className="text-lg font-semibold text-gray-900">
                                        #{selectedBooking.id}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Your Role
                                    </label>
                                    <p className="text-lg font-semibold text-indigo-600">
                                        {selectedBooking.role}
                                    </p>
                                </div>
                            </div>

                            {/* Expert/Client Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {user?.role === "Expert" ? "Client Name" : "Expert Name"}
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {user?.role === "Expert" ? (selectedBooking.ClientName || selectedBooking.clientName || `Client #${selectedBooking.clientId}`) : (selectedBooking.ExpertName || selectedBooking.expertName || `Expert #${selectedBooking.expertId}`)}
                                </p>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                                    selectedBooking.status === "Finished"
                                        ? "bg-green-50 text-green-700"
                                        : selectedBooking.status === "Cancelled"
                                        ? "bg-red-50 text-red-700"
                                        : selectedBooking.status === "Accepted"
                                        ? "bg-blue-50 text-blue-700"
                                        : "bg-indigo-50 text-indigo-700"
                                }`}>
                                    {selectedBooking.status}
                                </span>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <p className="text-gray-700 bg-gray-50 rounded-md p-3">
                                    {selectedBooking.description || "No description provided"}
                                </p>
                            </div>

                            {/* Requested Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Requested Date
                                </label>
                                <p className="text-gray-900">
                                    {selectedBooking.requestedAt
                                        ? new Date(selectedBooking.requestedAt).toLocaleString()
                                        : "N/A"}
                                </p>
                            </div>

                            {/* Rating and Review (if available) */}
                            {selectedBooking.rating && (
                                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Rating
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-yellow-500">
                                                ★ {selectedBooking.rating}/10
                                            </span>
                                        </div>
                                    </div>
                                    {selectedBooking.reviewComment && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Review
                                            </label>
                                            <p className="text-gray-700 text-sm">
                                                "{selectedBooking.reviewComment}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
                            <button
                                onClick={closeBookingModal}
                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Close
                            </button>
                            {user?.role === "Expert" ? (
                                selectedBooking.status === "Pending" ? (
                                    <>
                                        <button
                                            onClick={() => handleChangeBookingStatus(selectedBooking.id, "Accepted")}
                                            className="inline-flex items-center rounded-md bg-yellow-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-400"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleChangeBookingStatus(selectedBooking.id, "Canceled")}
                                            disabled={cancellingBookingId === selectedBooking.id}
                                            className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-70"
                                        >
                                            {cancellingBookingId === selectedBooking.id ? "Cancelling..." : "Cancel Booking"}
                                        </button>
                                    </>
                                ) : selectedBooking.status === "Accepted" ? (
                                    <button
                                        onClick={() => handleChangeBookingStatus(selectedBooking.id, "Finished")}
                                        className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                                    >
                                        Mark Finished
                                    </button>
                                ) : null
                            ) : (
                                selectedBooking.status === "Pending" && (
                                    <button
                                        onClick={() => handleCancelBooking(selectedBooking.id)}
                                        disabled={cancellingBookingId === selectedBooking.id}
                                        className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {cancellingBookingId === selectedBooking.id ? "Cancelling..." : "Cancel Booking"}
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;