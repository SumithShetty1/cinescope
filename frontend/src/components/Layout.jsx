import { Outlet } from "react-router-dom";
import React from 'react'

// Layout component serves as a wrapper for nested routes 
function Layout() {
  return (
    <main>

      {/* Outlet will render the child route's component here */}
      <Outlet />
      
    </main>
  )
}

export default Layout
