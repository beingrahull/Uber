import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CaptainLogout = () => {
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);

        try {
            await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/captain/logout-captain`,
                { withCredentials: true }
            );
        } catch (err) {
            console.error("Captain logout failed:", err);
        } finally {
            localStorage.removeItem('captainToken');
            navigate('/captain-login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-7">
            <div className="w-full max-w-md text-center">
                <img
                    className="w-16 mx-auto mb-8"
                    src="https://logos-world.net/wp-content/uploads/2020/05/Uber-Emblem-700x394.png"
                    alt="Uber Logo"
                />

                <h1 className="text-2xl font-semibold mb-3">Log out?</h1>
                <p className="text-gray-600 mb-8">
                    You'll need to sign in again to start accepting rides.
                </p>

                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="bg-[#111] text-white font-semibold w-full rounded-lg px-4 py-3 text-base hover:bg-[#222] transition-colors mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoggingOut ? 'Logging out…' : 'Yes, log me out'}
                </button>

                <button
                    onClick={() => navigate(-1)}
                    disabled={isLoggingOut}
                    className="bg-[#eeeeee] text-[#111] font-semibold w-full rounded-lg px-4 py-3 text-base hover:bg-[#e0e0e0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default CaptainLogout;