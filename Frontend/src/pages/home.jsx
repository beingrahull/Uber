import React from 'react'
import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div>
        <div 
          style={{ backgroundImage: `url('https://images.squarespace-cdn.com/content/v1/5ff2f50d3fe4fe33db909335/1610033142382-LUMSRO76I5P89EYQ2L58/Career%2BDay_10x8_Photobooth_Working%2BFile_R1-01.jpg?format=1000w')` }}
          className='bg-cover bg-center h-screen pt-8 flex justify-between flex-col w-full'
        >
            <img className='w-18 ml-8' src='https://logos-world.net/wp-content/uploads/2020/05/Uber-Logo-700x394.png' alt="Uber Logo"/>
            <div className='bg-white pb-8 py-4 px-4'>
                <h3 className='text-[30px] font-semibold pl-1 h-10'>Getting started with Uber</h3>
                <Link to="/user-login" className='flex items-center justify-center w-full bg-black text-white py-3 rounded-lg mt-5'>Continue</Link>
            </div>
        </div>
    </div>
  )
}

export default Home