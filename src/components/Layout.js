import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <header>
        <h1>WorkConnect</h1>
        <nav>
          <a href="/home">Home</a>
          <a href="/calendar">Calendar</a>
          <a href="/messages">Messages</a>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>&copy; 2024 WorkConnect. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
