// This file is replaced by direct API calls to our Cloudflare Worker
export async function assessCEFRLevel(
  text: string, 
  skill: 'reading' | 'writing' | 'speaking' | 'listening'
): Promise<string> {
  const response = await fetch('/api/assessment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ text, type: skill }),
  });

  if (!response.ok) {
    throw new Error('Assessment failed');
  }

  const data = await response.json();
  return data.assessment;
}