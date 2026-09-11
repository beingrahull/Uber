import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CaptainSignup = () => {
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [mobilenumber, setMobilenumber] = useState('');
  const [password, setPassword] = useState('');
  const [plate, setPlate] = useState('');
  const [colour, setColour] = useState('');
  const [model, setModel] = useState('');
  const [vehicleType, setVehicleType] = useState('Cab');
  const [capacity, setCapacity] = useState(4);
  const [error, setError] = useState('');

  const vehicleOptions = [
    { id: 'Cab', label: 'Cab', cap: 4 },
    { id: 'Motorcycle', label: 'Motorcycle', cap: 1 },
    { id: 'Auto', label: 'Auto', cap: 3 },
  ];

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^\d{10}$/.test(mobilenumber)) {
      setError('Mobile number must be exactly 10 digits.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    const captainData = {
      fullname: { firstname, lastname },
      email,
      mobileNo: mobilenumber,
      password,
      plate,
      colour,
      model,
      vehicleType,
      capacity: Number(capacity)
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/captain/register-captain`,
        captainData,
        { withCredentials: true }
      );

      if (response.status === 201) {
        const data = response.data;
        if (data.token) {
          localStorage.setItem('captainToken', data.token);
        }
        navigate('/captain-home');
      }
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.error
        || 'Registration failed';
      setError(msg);
      console.error("Captain signup failed:", err.response?.data || err.message);
    }
  };

  return (
    <div className="p-7 min-h-screen flex flex-col justify-between bg-white">
      <div>
        <img
          className="w-20 mb-6"
          src="https://logos-world.net/wp-content/uploads/2020/05/Uber-Emblem-700x394.png"
          alt="Uber Logo"
        />

        <form onSubmit={submitHandler}>
          <h3 className="text-lg font-medium mb-2">What's your name?</h3>
          <div className="flex gap-4 mb-5">
            <input
              required
              type="text"
              placeholder="First name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              minLength={3}
              className="bg-[#eeeeee] rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base focus:outline-none focus:border-black"
            />
            <input
              type="text"
              placeholder="Last name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              minLength={3}
              className="bg-[#eeeeee] rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base focus:outline-none focus:border-black"
            />
          </div>

          <h3 className="text-lg font-medium mb-2">What's your email?</h3>
          <input
            required
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#eeeeee] mb-5 rounded px-4 py-2 border w-full text-lg placeholder:text-base focus:outline-none focus:border-black"
          />

          <h3 className="text-lg font-medium mb-2">Mobile Number</h3>
          <input
            required
            type="tel"
            placeholder="Enter 10-digit number"
            value={mobilenumber}
            onChange={(e) => setMobilenumber(e.target.value)}
            className="bg-[#eeeeee] mb-5 rounded px-4 py-2 border w-full text-lg placeholder:text-base focus:outline-none focus:border-black"
          />
          {error && <p className="text-red-500 text-sm -mt-3 mb-3">{error}</p>}

          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <input
            required
            type="password"
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            className="bg-[#eeeeee] mb-5 rounded px-4 py-2 border w-full text-lg placeholder:text-base focus:outline-none focus:border-black"
          />

          <h2 className="text-xl font-semibold border-b pb-2 mb-4 mt-6 text-gray-700">
            Vehicle Details
          </h2>

          <div className="flex gap-4 mb-5">
            <div className="w-1/2">
              <h3 className="text-base font-medium mb-2">Vehicle Model</h3>
              <input
                required
                type="text"
                placeholder="e.g. Honda City"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                minLength={3}
                className="bg-[#eeeeee] rounded px-4 py-2 border w-full text-lg placeholder:text-base focus:outline-none focus:border-black"
              />
            </div>
            <div className="w-1/2">
              <h3 className="text-base font-medium mb-2">Plate Number</h3>
              <input
                required
                type="text"
                placeholder="e.g. DL-3C-AA-1111"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                className="bg-[#eeeeee] rounded px-4 py-2 border w-full text-lg placeholder:text-base focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="mb-5">
            <h3 className="text-base font-medium mb-2">Vehicle Colour</h3>
            <input
              required
              type="text"
              placeholder="e.g. White"
              value={colour}
              onChange={(e) => setColour(e.target.value)}
              minLength={3}
              className="bg-[#eeeeee] rounded px-4 py-2 border w-full text-lg placeholder:text-base focus:outline-none focus:border-black"
            />
          </div>

          <h3 className="text-lg font-medium mb-3">Vehicle Type</h3>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {vehicleOptions.map((option) => {
              const isSelected = vehicleType === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setVehicleType(option.id);
                    setCapacity(option.cap);
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 text-center min-h-[70px] transition-all duration-200
                    ${
                      isSelected
                        ? 'border-black bg-black text-white shadow-md scale-[1.02]'
                        : 'border-gray-200 bg-[#eeeeee] text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <span className="font-semibold text-base leading-tight">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="submit"
            className="bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg"
          >
            Register as Captain
          </button>
        </form>

        <p className="text-center mb-6">
          Already have a Captain account?{' '}
          <Link to="/captain-login" className="text-blue-600 font-medium">
            Login here
          </Link>
        </p>
      </div>

      <div>
        <Link
          to="/user-signup"
          className="bg-[#d5622d] flex items-center justify-center text-white font-semibold mb-5 rounded px-4 py-2 w-full text-lg"
        >
          Sign up as a User instead
        </Link>
      </div>
    </div>
  );
};

export default CaptainSignup;