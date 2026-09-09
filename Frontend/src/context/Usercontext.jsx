import React, { createContext, useState } from 'react' // 1. Added missing imports

// 2. Created and exported the context object cleanly
export const UserContextProvider = createContext()

const Usercontext = ({ children }) => {

  // 3. FIXED: Correct array destructuring structure for useState hook
  const [credData, setCredData] = useState({
    email: '',
    mobileNo: '',
    fullname: {
      firstname: '',
      lastname: ''
    }
  });

  return (
    <div>
      {/* 4. FIXED: Passed both state value and setter function down inside an object wrapper */}
      <UserContextProvider.Provider value={{ credData, setCredData }}>
        {children}
      </UserContextProvider.Provider>
    </div>
  )
}

export default Usercontext
