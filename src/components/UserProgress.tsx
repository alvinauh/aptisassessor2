import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '../types';

interface UserProgressProps {
  user: User;
}

interface CEFRLevels {
  speaking: string;
  listening: string;
  reading: string;
  writing: string;
}

const UserProgress: React.FC<UserProgressProps> = ({ user }) => {
  const [progress, setProgress] = useState<CEFRLevels | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user-progress/${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProgress(response.data);
      } catch (error) {
        console.error('Error fetching user progress:', error);
      }
    };

    fetchProgress();
  }, [user.id]);

  if (!progress) {
    return <div>Loading progress...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Your Progress</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <p>Here's your current CEFR level for each skill:</p>
                <ul className="list-disc space-y-2 pl-4">
                  <li>Speaking: {progress.speaking || 'Not assessed'}</li>
                  <li>Listening: {progress.listening || 'Not assessed'}</li>
                  <li>Reading: {progress.reading || 'Not assessed'}</li>
                  <li>Writing: {progress.writing || 'Not assessed'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProgress;