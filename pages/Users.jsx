import toast, { Toaster } from 'react-hot-toast';
import { getAllUsers, getCurrectUser } from '../API/userAPI'; // Check spelling in your actual file (getCurrectUser vs getCurrentUser)
import UsersTable from '../components/UsersTable';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSectionStore } from '@/store/sectionStore';

const Users = () => {
  const [users, setUsers] = useState([]); // Standardized variable name to lowercase 'users'
  const [currentUser, setCurrentUser] = useState({});
  const navigate = useNavigate();
  const setSection = useSectionStore((s) => s.setSection);

  useEffect(() => {
    setSection('users');

    // Initial Fetch
    (async () => {
      try {
        const response = await getAllUsers();
        setUsers(response.data);

        const user = await getCurrectUser();
        setCurrentUser({
          currectUserName: user.name,
          currentUserRole: user.role,
          isOwner: user.role.includes('Owner'),
          isAdmin: user.role.includes('Admin'),
          isManager: user.role.includes('Manager'),
        });
      } catch (err) {
        console.error(err);
        navigate('/');
        toast.error('Session expired. Please login again.');
        setUsers([]);
      }
    })();
  }, []); // Removed 'users' from dependency array to prevent loops if logic changes

  const refreshUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (err) {
      navigate('/');
      toast.error('Session expired. Please login again.');
      setUsers([]);
    }
  };

  return (
    <div className="min-h-screen ">
      <Toaster position="top-right" />
      <div className="max-w-[1600px] mx-auto">
        <UsersTable
          users={users}
          isOwner={currentUser.isOwner}
          currentUserName={currentUser.currectUserName}
          currentUserRole={currentUser.currentUserRole}
          isAdmin={currentUser.isAdmin}
          isManager={currentUser.isManager}
          refreshUsers={refreshUsers}
        />
      </div>
    </div>
  );
};

export default Users;
