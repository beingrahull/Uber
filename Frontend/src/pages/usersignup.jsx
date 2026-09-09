import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const UserSignup = () => {
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [password, setPassword] = useState('');
  const [submittedData, setSubmittedData] = useState(null);
  
  // Error states
  const [mobileError, setMobileError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Handle mobile input - only digits
  const handleMobileChange = (e) => {
    const value = e.target.value;
    const digitsOnly = value.replace(/\D/g, '');
    setMobileNo(digitsOnly);
    // Clear error when user starts typing again
    if (mobileError) {
      setMobileError('');
    }
  };

  // Handle password change - clear error when typing
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) {
      setPasswordError('');
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // Validate mobile number
    if (mobileNo.length !== 10) {
      setMobileError('Mobile number must be exactly 10 digits');
      return;
    }

    // Validate password
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    const userData = {
      fullname: {
        firstname,
        lastname,
      },
      email,
      mobileNo,
      password,
    };

    setSubmittedData(userData);
    console.log(userData);

    // Clear form
    setFirstname('');
    setLastname('');
    setEmail('');
    setMobileNo('');
    setPassword('');
    setMobileError('');
    setPasswordError('');

    
  };

  return (
    <div className="p-7 min-h-screen flex flex-col justify-between bg-white">
      <div className="flex-1 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto">
          <img 
            className='w-16 mb-8 ml-0' 
            src='https://logos-world.net/wp-content/uploads/2020/05/Uber-Logo-700x394.png' 
            alt="Uber Logo"
          />

          <form onSubmit={submitHandler}>
            <h3 className="text-base font-medium mb-2">What's your name?</h3>
            <div className="flex gap-4 mb-5">
              <input
                required
                type="text"
                placeholder="First name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                minLength={3}
                className="bg-[#eeeeee] rounded-lg px-4 py-3 border w-1/2 text-base placeholder:text-base focus:outline-none focus:border-black transition-colors"
              />
              <input
                type="text"
                placeholder="Last name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                minLength={3}
                className="bg-[#eeeeee] rounded-lg px-4 py-3 border w-1/2 text-base placeholder:text-base focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <h3 className="text-base font-medium mb-2">What's your email?</h3>
            <input
              required
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#eeeeee] mb-5 rounded-lg px-4 py-3 border w-full text-base placeholder:text-base focus:outline-none focus:border-black transition-colors"
            />

            <h3 className="text-base font-medium mb-2">Mobile Number</h3>
            <input
              required
              type="tel"
              placeholder="Enter 10-digit number"
              value={mobileNo}
              onChange={handleMobileChange}
              className={`bg-[#eeeeee] rounded-lg px-4 py-3 border w-full text-base focus:outline-none focus:border-black transition-colors ${
                mobileError ? 'border-red-500 focus:border-red-500' : ''
              }`}
            />
            {mobileError && (
              <p className="text-red-500 text-sm mt-1 mb-4">
                {mobileError}
              </p>
            )}

            <h3 className="text-base font-medium mb-2">Enter Password</h3>
            <input
              required
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={handlePasswordChange}
              className={`bg-[#eeeeee] rounded-lg px-4 mb-4 py-3 border w-full text-base placeholder:text-base focus:outline-none focus:border-black transition-colors ${
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
              Register as User
            </button>
          </form>

          <p className="text-center mb-6 text-sm">
            Already have an account?{' '}
            <Link to="/user-login" className="text-blue-600 font-medium hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto">
        <Link
          to="/captain-signup"
          className="bg-[#d5622d] flex items-center justify-center text-white font-semibold rounded-lg px-4 py-3 w-full text-base hover:bg-[#c45528] transition-colors"
        >
          Sign up as a Captain instead
        </Link>
      </div>
    </div>
  );
};

export default UserSignup;