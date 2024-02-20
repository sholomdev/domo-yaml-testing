import React from 'react';
import Editor from 'react-simple-code-editor';
import YAML from 'yaml';
// import 'prismjs/components/prism-clike';
// import 'prismjs/components/prism-yaml';
// import 'prismjs/themes/prism.css'; //Example style, you can use another
import { Highlight, themes } from 'prism-react-renderer';
import { Button } from './ui/button';

const testCode = {
  version: 2,
  models: [
    {
      name: 'events',
      columns: [
        {
          name: 'event_id',
          description: 'This is a unique identifier for the event',
          tests: ['unique', 'not_null'],
        },
        {
          name: 'event_time',
          description:
            'When the event occurred in UTC (eg. 2018-01-01 12:00:00)',
          tests: ['not_null'],
        },
        {
          name: 'user_id',
          description: 'The ID of the user who recorded the event',
          tests: [
            'not_null',
            {
              relationships: {
                to: "ref('users')",
                field: 'id',
              },
            },
          ],
        },
      ],
    },
  ],
};

interface PropTypes {
  originalCode: string;
  setOriginalCode: React.Dispatch<React.SetStateAction<string>>;
}

const SimpEditor = ({ originalCode, setOriginalCode }: PropTypes) => {
  const [code, setCode] = React.useState(originalCode);

  const handleSaveChanges = () => {
    try {
      console.log(YAML.parse(code));
      console.log(YAML.stringify(testCode));
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="text-left">
      <Button
        variant="outline"
        className="text-green-700"
        onClick={() => handleSaveChanges()}
      >
        Save
      </Button>

      <Editor
        value={code}
        onValueChange={(code) => setCode(code)}
        highlight={(code) => (
          <Highlight theme={themes.github} code={code} language="yml">
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre style={style}>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    <span>{i + 1}</span>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        )}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
        }}
      />
    </div>
  );
};

export default SimpEditor;
