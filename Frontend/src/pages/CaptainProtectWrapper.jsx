import React, { useContext, useEffect, useState } from 'react';
import { CaptainDataContext } from '../context/CaptainContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CaptainProtectWrapper = ({ children }) => {
    const navigate = useNavigate();
    const { setCaptain } = useContext(CaptainDataContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('captainToken');

        if (!token) {
            navigate('/captain-login');
            return;
        }

        axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/captain/captain-profile`,
            { withCredentials: true }
        )
            .then(response => {
                if (response.status === 200) {
                    // ✅ matches the controller's `captain` key now
                    setCaptain(response.data.captain);
                    setIsLoading(false);
                }
            })
            .catch(err => {
                console.error("Captain auth check failed:", err);
                localStorage.removeItem('captainToken');
                navigate('/captain-login');
            });
    }, [navigate, setCaptain]);

    if (isLoading) return <div>Loading...</div>;
    return <>{children}</>;
};

export default CaptainProtectWrapper;