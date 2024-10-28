import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface UserProgress {
  _id: string;
  username: string;
  email: string;
  cefr_levels: {
    speaking: string;
    listening: string;
    reading: string;
    writing: string;
  };
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<UserProgress[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Username</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Speaking</th>
                    <th className="px-4 py-2">Listening</th>
                    <th className="px-4 py-2">Reading</th>
                    <th className="px-4 py-2">Writing</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="border px-4 py-2">{user.username}</td>
                      <td className="border px-4 py-2">{user.email}</td>
                      <td className="border px-4 py-2">{user.cefr_levels.speaking || 'N/A'}</td>
                      <td className="border px-4 py-2">{user.cefr_levels.listening || 'N/A'}</td>
                      <td className="border px-4 py-2">{user.cefr_levels.reading || 'N/A'}</td>
                      <td className="border px-4 py-2">{user.cefr_levels.writing || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;