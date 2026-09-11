import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Start from './pages/Start';
import Home from './pages/Home';
import UserLogin from './pages/userlogin';
import UserSignup from './pages/usersignup';
import UserLogout from './pages/UserLogout';
import UserProtectWrapper from './pages/UserProtectWrapper';

import CaptainHome from './pages/CaptainHome';
import CaptainLogin from './pages/captainlogin';
import CaptainSignup from './pages/captainsignup';
import CaptainLogout from './pages/CaptainLogout';
import CaptainProtectWrapper from './pages/CaptainProtectWrapper';

const App = () => {
    return (
        <div>
            <Routes>

                <Route path="/" element={<Start />} />

                {/* ---------- USER ---------- */}
                <Route path="/user-login" element={<UserLogin />} />
                <Route path="/user-signup" element={<UserSignup />} />
                <Route
                    path="/home"
                    element={
                        <UserProtectWrapper>
                            <Home />
                        </UserProtectWrapper>
                    }
                />
                <Route
                    path="/user-logout"
                    element={
                        <UserProtectWrapper>
                            <UserLogout />
                        </UserProtectWrapper>
                    }
                />

                {/* ---------- CAPTAIN ---------- */}
                <Route path="/captain-login" element={<CaptainLogin />} />
                <Route path="/captain-signup" element={<CaptainSignup />} />
                <Route
                    path="/captain-home"
                    element={
                        <CaptainProtectWrapper>
                            <CaptainHome />
                        </CaptainProtectWrapper>
                    }
                />
                <Route
                    path="/captain-logout"
                    element={
                        <CaptainProtectWrapper>
                            <CaptainLogout />
                        </CaptainProtectWrapper>
                    }
                />

            </Routes>
        </div>
    );
};

export default App;