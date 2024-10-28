import React, { useState, useRef } from 'react';
import { User } from '../types';
import { api } from '../lib/api';
import { Mic, Square, Loader } from 'lucide-react';

interface SpeakingProps {
  user: User;
}

const Speaking: React.FC<SpeakingProps> = ({ user }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [assessment, setAssessment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        chunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(chunks.current, { type: 'audio/webm' });
        setIsLoading(true);
        try {
          const response = await api.audio.upload(audioBlob);
          // Assessment will be processed asynchronously via Cloudflare Queue
          setAssessment('Your recording is being processed. Results will be available soon.');
        } catch (error) {
          console.error('Upload error:', error);
          setAssessment('Error processing recording. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
      setAssessment('Error accessing microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold">Speaking Practice</h1>
            <div className="mt-8 space-y-6">
              <div className="flex justify-center">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`p-4 rounded-full ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white transition-colors`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader className="w-6 h-6 animate-spin" />
                  ) : isRecording ? (
                    <Square className="w-6 h-6" />
                  ) : (
                    <Mic className="w-6 h-6" />
                  )}
                </button>
              </div>
              {assessment && (
                <div className="mt-4 p-4 bg-gray-100 rounded">
                  <h3 className="font-bold">Assessment Result:</h3>
                  <p>{assessment}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Speaking;