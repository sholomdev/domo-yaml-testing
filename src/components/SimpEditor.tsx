import React, { useEffect } from 'react';
import { toast } from 'sonner';
import Editor from 'react-simple-code-editor';
import { Highlight, themes } from 'prism-react-renderer';
import { Button } from './ui/button';
import {
  cn,
  downloadText,
  getErrorMessage,
  startCodeEngineFunction,
} from '@/lib/utils';
import { FileDown, Save, Undo2, Play, LucideRotateCw } from 'lucide-react';
import { DatasetType } from '@/models/dataset';
import { saveYaml } from '@/models/yaml';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { AlertDestructive } from './ui/alertDestructive';
import buttonVariants from './ui/buttonVariants';

interface PropTypes {
  originalCode: string;
  setOriginalCode: React.Dispatch<React.SetStateAction<string>>;
  datasets: DatasetType[];
}

const SimpEditor = ({ originalCode, setOriginalCode, datasets }: PropTypes) => {
  const [code, setCode] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  useEffect(() => {
    setCode(originalCode);
  }, [originalCode]);

  const handleSaveChanges = () => {
    setIsLoading(true);
    saveYaml(code, datasets)
      .then(() => {
        setOriginalCode(code);
        toast.success(`YAML saved.`);
        setErrorMessage('');
      })
      .catch((e) => setErrorMessage(getErrorMessage(e)))
      .finally(() => setIsLoading(false));
  };

  const handleRunTests = () => {
    setIsLoading(true);
    startCodeEngineFunction('runTests', {})
      .then((result) => {
        toast.success(`Tests ran.`);
        setIsLoading(false);
        console.log(result);
      })
      .catch((e) => console.log(e));
  };

  return (
    <div>
      {errorMessage && AlertDestructive(errorMessage)}
      <div className="flex flex-1 items-center mt-6 space-x-2 px-3">
        <Button
          variant="outline"
          className="h-8 px-2 lg:px-3"
          onClick={() => handleSaveChanges()}
          disabled={code === originalCode}
        >
          Save Changes
          <Save className="ml-2 h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 px-2 lg:px-3"
          onClick={() => {
            setCode(originalCode);
            setErrorMessage('');
          }}
          disabled={code === originalCode}
        >
          Reset
          <Undo2 className="ml-2 h-4 w-4" />
        </Button>

        <Button
          className="h-8 px-2 lg:px-3"
          variant="outline"
          onClick={() => downloadText(code)}
        >
          Download
          <FileDown className="ml-2 h-4 w-4" />
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              className={cn(code !== originalCode && ' cursor-not-allowed')}
            >
              <a
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'h-8 px-2 lg:px-3 ml-auto',
                  (code !== originalCode || isLoading) &&
                    'pointer-events-none opacity-50'
                )}
                onClick={handleRunTests}
                //disabled={code !== originalCode}
              >
                Run Tests
                {isLoading ? (
                  <LucideRotateCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Play className="ml-2 h-4 w-4" />
                )}
              </a>
            </TooltipTrigger>
            <TooltipContent className={cn(code === originalCode && 'hidden')}>
              <p>Save changes first!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Editor
        value={code}
        onValueChange={(code) => {
          setCode(code);
        }}
        highlight={(code) => (
          <Highlight theme={themes.github} code={code} language="yml">
            {({ style, tokens, getLineProps, getTokenProps }) => (
              <pre style={style}>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    <span className="mr-3 inline-block w-2">{i + 1}</span>
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
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          fontSize: 12,
        }}
      />
    </div>
  );
};

export default SimpEditor;
