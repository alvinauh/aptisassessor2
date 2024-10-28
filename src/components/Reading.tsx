import React, { useState } from 'react';
import { User } from '../types';
import { assessCEFRLevel } from '../utils/openai';
import { BookOpen, Loader } from 'lucide-react';

interface ReadingProps {
  user: User;
}

const ReadingPassages = [
  {
    id: 1,
    title: 'Technology and Society',
    content: 'As technology continues to evolve...',
    questions: [
      { id: 1, text: 'What is the main theme of the passage?' },
      { id: 2, text: 'How does the author view technological progress?' },
    ],
  },
  {
    id: 2,
    title: 'Environmental Challenges',
    content: 'Climate change presents one of the most significant...',
    questions: [
      { id: 1, text: 'What are the main environmental challenges discussed?' },
      { id: 2, text: 'What solutions does the author propose?' },
    ],
  },
];

const Reading: React.FC<ReadingProps> = ({ user }) => {
  const [selectedPassage, setSelectedPassage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [assessment, setAssessment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await assessCEFRLevel(
        JSON.stringify({
          passage: ReadingPassages[selectedPassage],
          answers,
        }),
        'reading'
      );
      setAssessment(result);
    } catch (error) {
      console.error('Assessment error:', error);
      setAssessment('Error processing assessment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <BookOpen className="w-6 h-6 text-blue-500 mr-2" />
            <h1 className="text-2xl font-semibold">Reading Practice</h1>
          </div>

          <div className="space-y-6">
            <div className="flex space-x-4">
              {ReadingPassages.map((passage, index) => (
                <button
                  key={passage.id}
                  onClick={() => setSelectedPassage(index)}
                  className={`px-4 py-2 rounded ${
                    selectedPassage === index
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {passage.title}
                </button>
              ))}
            </div>

            {selectedPassage !== null && (
              <div className="space-y-4">
                <div className="prose max-w-none">
                  <h2 className="text-xl font-semibold mb-2">
                    {ReadingPassages[selectedPassage].title}
                  </h2>
                  <p>{ReadingPassages[selectedPassage].content}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Questions</h3>
                  {ReadingPassages[selectedPassage].questions.map((question) => (
                    <div key={question.id} className="space-y-2">
                      <p>{question.text}</p>
                      <textarea
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        value={answers[`${selectedPassage}-${question.id}`] || ''}
                        onChange={(e) =>
                          setAnswers({
                            ...answers,
                            [`${selectedPassage}-${question.id}`]: e.target.value,
                          })
                        }
                        placeholder="Enter your answer here..."
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Submit Answers'
                  )}
                </button>

                {assessment && (
                  <div className="mt-4 p-4 bg-gray-100 rounded">
                    <h3 className="font-bold">Assessment Result:</h3>
                    <p>{assessment}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reading;