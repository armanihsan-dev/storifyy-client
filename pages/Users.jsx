import toast, { Toaster } from 'react-hot-toast';
import { getAllUsers, getCurrectUser } from '../API/userAPI';
import UsersTable from '../components/UsersTable';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const [Users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const navigate = useNavigate();

  const refreshUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (err) {
      // Auto logout on unauthorized
      navigate('/');
      toast.error('Session expired. Please login again.');
      setUsers([]); // prevent map errors
    }
  };

  useEffect(() => {
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
        navigate('/');
        toast.error('Session expired. Please login again.');
        setUsers([]); // prevent map crash
      }
    })();
  }, []);
  return (
    <div>
      <Toaster />

      <UsersTable
        users={Users}
        isOwner={currentUser.isOwner}
        currentUserName={currentUser.currectUserName}
        currentUserRole={currentUser.currentUserRole} // ✅ FIXED
        isAdmin={currentUser.isAdmin}
        isManager={currentUser.isManager}
        refreshUsers={refreshUsers}
      />
    </div>
  );
};

export default Users;
