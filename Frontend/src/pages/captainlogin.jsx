import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CaptainDataContext } from '../context/CaptainContext';

const CaptainLogin = () => {
    const navigate = useNavigate();
    const { setCaptain } = useContext(CaptainDataContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (passwordError) setPasswordError('');
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setPasswordError('');

        if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters long');
            return;
        }

        const payload = { email, password };

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/captain/login-captain`,
                payload,
                { withCredentials: true }
            );

            if (response.status === 200) {
                const data = response.data;
                setCaptain(data.captain);
                if (data.token) {
                    localStorage.setItem('captainToken', data.token);
                }
                // ✅ only clear fields on success
                setEmail('');
                setPassword('');
                navigate('/captain-home');
            }
        } catch (err) {
            console.error("Captain login failed:", err.response?.data || err.message);
            setPasswordError(err.response?.data?.message || 'Login failed');
            // ✅ do NOT clear email/password on failure
        }
    };

    return (
        <div className="p-7 min-h-screen w-full flex flex-col justify-between bg-white">
            <div className="flex-1 flex flex-col justify-center">
                <div className="w-full max-w-md mx-auto">
                    <img
                        className="w-16 mb-8 ml-0"
                        src="https://logos-world.net/wp-content/uploads/2020/05/Uber-Logo-700x394.png"
                        alt="Uber Logo"
                    />

                    <form onSubmit={submitHandler}>
                        <h1 className="text-2xl font-semibold mb-6">
                            Welcome back, Captain
                        </h1>

                        <h2 className="text-base font-medium mb-2">
                            Email
                        </h2>
                        <input
                            type="email"
                            placeholder="email@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-[#eeeeee] mb-5 rounded-lg px-4 py-3 border w-full text-base placeholder:text-base focus:outline-none focus:border-black transition-colors"
                        />

                        <h2 className="text-base font-medium mb-2">Password</h2>
                        <input
                            required
                            type="password"
                            placeholder="Minimum 8 characters"
                            value={password}
                            onChange={handlePasswordChange}
                            className={`bg-[#eeeeee] rounded-lg mb-6 px-4 py-3 border w-full text-base focus:outline-none focus:border-black transition-colors ${
                                passwordError ? 'border-red-500 focus:border-red-500' : ''
                            }`}
                        />
                        {passwordError && (
                            <p className="text-red-500 text-sm mt-1 mb-4">
                                {passwordError}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="bg-[#111] text-white font-semibold w-full rounded-lg px-4 py-3 text-base hover:bg-[#222] transition-colors mb-4"
                        >
                            Login
                        </button>
                    </form>

                    <p className="text-center mb-6 text-sm">
                        New here?{' '}
                        <Link
                            to="/captain-signup"
                            className="text-blue-600 font-medium hover:underline"
                        >
                            Create an Account
                        </Link>
                    </p>
                </div>
            </div>

            <div className="w-full max-w-md mx-auto">
                <Link
                    to="/user-login"
                    className="bg-[#d5622d] flex items-center justify-center text-white font-semibold rounded-lg px-4 py-3 w-full text-base hover:bg-[#c45528] transition-colors"
                >
                    Login as User
                </Link>
            </div>
        </div>
    );
};

export default CaptainLogin;