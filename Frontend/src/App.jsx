import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import UserLogin from './pages/userlogin';
import UserSignup from './pages/usersignup';     
import CaptainLogin from './pages/captainlogin';
import CaptainSignup from './pages/captainsignup';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-signup" element={<UserSignup />} />   {/* lowercase consistent */}
        <Route path="/captain-login" element={<CaptainLogin />} />
        <Route path="/captain-signup" element={<CaptainSignup />} />
      </Routes>
    </div>
  );
};

export default App;