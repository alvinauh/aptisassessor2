import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { api } from '../lib/api';
import { LineChart, BarChart2, Trophy } from 'lucide-react';

interface ProgressProps {
  user: User;
}

interface SkillProgress {
  skill: string;
  level: string;
  date: string;
  improvement: number;
}

const Progress: React.FC<ProgressProps> = ({ user }) => {
  const [progress, setProgress] = useState<SkillProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await api.assessment.getProgress(user.id);
        setProgress(data);
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [user.id]);

  const getSkillColor = (skill: string) => {
    const colors = {
      speaking: 'bg-blue-500',
      listening: 'bg-green-500',
      reading: 'bg-yellow-500',
      writing: 'bg-purple-500',
    };
    return colors[skill as keyof typeof colors] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
            <h1 className="text-2xl font-semibold">Your Progress</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skill Cards */}
            <div className="space-y-4">
              {progress.map((item) => (
                <div
                  key={item.skill}
                  className="bg-white rounded-lg border p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full ${getSkillColor(
                          item.skill
                        )} mr-2`}
                      />
                      <h3 className="font-semibold capitalize">{item.skill}</h3>
                    </div>
                    <span className="text-lg font-bold">{item.level}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Last assessed: {new Date(item.date).toLocaleDateString()}
                  </div>
                  {item.improvement > 0 && (
                    <div className="mt-1 text-sm text-green-600">
                      +{item.improvement} level improvement
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg border p-4 shadow-sm">
                <div className="flex items-center mb-4">
                  <LineChart className="w-5 h-5 text-blue-500 mr-2" />
                  <h3 className="font-semibold">Progress Over Time</h3>
                </div>
                {/* Add your chart component here */}
                <div className="h-48 bg-gray-50 rounded flex items-center justify-center">
                  Chart placeholder
                </div>
              </div>

              <div className="bg-white rounded-lg border p-4 shadow-sm">
                <div className="flex items-center mb-4">
                  <BarChart2 className="w-5 h-5 text-green-500 mr-2" />
                  <h3 className="font-semibold">Skill Distribution</h3>
                </div>
                {/* Add your chart component here */}
                <div className="h-48 bg-gray-50 rounded flex items-center justify-center">
                  Chart placeholder
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;