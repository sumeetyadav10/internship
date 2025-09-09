"use client";

import { useState } from 'react';

export default function DebugCheckPage() {
  const [applicationId, setApplicationId] = useState('LMS202509090002');
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const checkApplication = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/debug-application?id=${applicationId}`);
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      console.error('Error:', error);
      setDebugInfo({ error: 'Failed to fetch' });
    }
    setLoading(false);
  };
  
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Debug Application Check</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={applicationId}
          onChange={(e) => setApplicationId(e.target.value)}
          placeholder="Enter Application ID"
          style={{
            padding: '10px',
            marginRight: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '300px'
          }}
        />
        <button 
          onClick={checkApplication}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Checking...' : 'Check Application'}
        </button>
      </div>
      
      {debugInfo && (
        <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
          <h2>Debug Information:</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
          
          {debugInfo.documentDetails && debugInfo.documentDetails.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3>Document Analysis:</h3>
              {debugInfo.documentDetails.map((doc: any) => (
                <div key={doc.key} style={{ 
                  marginBottom: '15px', 
                  padding: '10px', 
                  background: doc.hasUrl ? '#d4edda' : '#f8d7da',
                  borderRadius: '4px'
                }}>
                  <strong>{doc.key}</strong>
                  <ul>
                    <li>Has Data: {doc.hasData ? '✅' : '❌'}</li>
                    <li>Has URL: {doc.hasUrl ? '✅' : '❌'}</li>
                    <li>File Name: {doc.fileName}</li>
                    <li>File Type: {doc.fileType}</li>
                    <li>URL Length: {doc.urlLength} characters</li>
                    <li>Structure: {doc.structure.join(', ')}</li>
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}