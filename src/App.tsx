import { useState } from 'react';
import './App.css';
import SimpEditor from './components/SimpEditor';
import { Button } from './components/ui/button';

const sampleCode = `version: 2

models:
  - name: events
    columns:
      - name: event_id
        description: This is a unique identifier for the event
        tests:
          - unique
          - not_null

      - name: event_time
        description: 'When the event occurred in UTC (eg. 2018-01-01 12:00:00)'
        tests:
          - not_null

      - name: user_id
        description: The ID of the user who recorded the event
        tests:
          - not_null
          - relationships:
              to: ref('users')
              field: id
`;

function App() {
  const [code, setCode] = useState(sampleCode);

  return (
    <>
      <h1 className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
        hello world
      </h1>
      <SimpEditor originalCode={code} setOriginalCode={setCode}></SimpEditor>
    </>
  );
}

export default App;
