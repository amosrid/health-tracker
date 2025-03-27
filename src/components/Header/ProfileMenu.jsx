import React from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
// ...existing code...

const ProfileMenu = ({ isOpen, onClose, session }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  const handleSyncData = () => {
    // Implement sync data functionality here
    console.log('Syncing data...');
    // You can add actual sync logic here
  };

  return (
    <div className={`profile-menu ${isOpen ? 'open' : ''}`}>
      <div className="menu-header">
        <h3>Menu</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>
      <div className="menu-items">
        <button onClick={() => router.push('/profile')}>Profile</button>
        <button onClick={() => router.push('/settings')}>Settings</button>
        <button onClick={handleSyncData}>Sync Data</button>
        <button onClick={handleLogout}>Sign Out</button>
      </div>
    </div>
  );
};

export default ProfileMenu;
