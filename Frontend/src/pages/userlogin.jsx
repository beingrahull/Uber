import React, { useState, useContext } from 'react'
import { Link } from "react-router-dom" 

const UserLogin = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mobilenumber, setmobilenumber] = useState('')
  const [mobileError, setMobileError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [UserData, setUserData] = useState({})

  const handleMobileChange = (e) => {
    const value = e.target.value
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, '')
    setmobilenumber(digitsOnly)
    // Clear error when user starts typing again
    if (mobileError) {
      setMobileError('')
    }
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    // Clear error when user starts typing again
    if (passwordError) {
      setPasswordError('')
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    // Validate mobile number
    if (mobilenumber.length !== 10) {
      setMobileError('Mobile number must be exactly 10 digits')
      return
    }

    // Validate password
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long')
      return
    }

    const UserData={
      email:email,
      password:password,
      mobilenumber:mobilenumber
    }

    console.log(UserData)
    setEmail('')
    setPassword('')
    setmobilenumber('')
    setMobileError('')
    setPasswordError('')
  }

  return (
    <div className="p-7 min-h-screen w-full flex flex-col justify-between bg-white">
      {/* Main content - takes available space and pushes button down */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto">
          {/* Logo - positioned more like Uber's official layout */}
          <img 
            className='w-16 mb-8 ml-0' 
            src='https://logos-world.net/wp-content/uploads/2020/05/Uber-Logo-700x394.png' 
            alt="Uber Logo"
          />

          <form onSubmit={(e) => {
            submitHandler(e)
          }}>
            <h1 className="text-2xl font-semibold mb-6">Getting Started</h1>

            <h2 className="text-base font-medium mb-2">What's your email?</h2>
            <input 
              type="email" 
              placeholder="email@example.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#eeeeee] mb-5 rounded-lg px-4 py-3 border w-full text-base placeholder:text-base focus:outline-none focus:border-black transition-colors"
            />
            
            <h2 className="text-base font-medium mb-2">Mobile Number</h2>
            <input
              required
              type="tel"
              placeholder="Enter 10-digit number"
              value={mobilenumber}
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

            <h2 className="text-base font-medium mb-2">Password</h2>
            <input
              required
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={handlePasswordChange}
              className={`bg-[#eeeeee] rounded-lg px-4 mb-4 py-3 border w-full text-base focus:outline-none focus:border-black transition-colors ${
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
              className='bg-[#111] text-white font-semibold w-full rounded-lg px-4 py-3 text-base hover:bg-[#222] transition-colors mb-4'
            >
              Login
            </button>
          </form>
          
          <p className="text-center mb-6 text-sm">
            New here? <Link to="/user-signup" className='text-blue-600 font-medium hover:underline'>Create an Account</Link>
          </p>
        </div>
      </div>

      {/* Bottom section - Login as Captain button */}
      <div className="w-full max-w-md mx-auto">
        <Link 
          to="/captain-login" 
          className='bg-[#d5622d] flex items-center justify-center text-white font-semibold rounded-lg px-4 py-3 w-full text-base hover:bg-[#c45528] transition-colors'
        >
          Login as Captain
        </Link>
      </div>
    </div>
  )
}

export default UserLogin