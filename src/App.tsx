import { useEffect, useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import './App.css';
import SimpEditor from './components/SimpEditor';
import { toast } from 'sonner';
import { getErrorMessage } from './lib/utils';
import { fetchDatasets, DatasetType } from './models/dataset';
import { fetchData, dataToYaml } from './models/yaml';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataTable from './components/DataTable';
import {
  TestMapType,
  TestResultType,
  fetchTestResults,
} from './models/testResults';

function App() {
  const [code, setCode] = useState('');
  const [datasets, setDatasets] = useState<DatasetType[]>([]);
  const [testResults, setTestResults] = useState<TestResultType[]>([]);
  const [testMap, setTestMap] = useState<TestMapType>({});
  useEffect(() => {
    fetchTestResults()
      .then((data) => {
        setTestResults(data.testData);
        setTestMap(data.testMap);
      })
      .catch((error) => toast(getErrorMessage(error)));

    fetchDatasets()
      .then((data) => setDatasets(data))
      .catch((error) => toast(getErrorMessage(error)));
    fetchData().then((data) => {
      setCode(dataToYaml(data));
    });
  }, []);
  return (
    <>
      <Toaster expand={true} position="top-right" />
      <Tabs defaultValue="table" className="w-full max-w-2xl m-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="table">Test Results</TabsTrigger>
          <TabsTrigger value="editor">YAML Editor</TabsTrigger>
        </TabsList>
        <TabsContent
          className="p-5 overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl"
          value="table"
        >
          <DataTable
            testResults={testResults}
            datasets={datasets}
            testMap={testMap}
          ></DataTable>
        </TabsContent>

        <TabsContent
          value="editor"
          className="p-5 overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl"
        >
          <SimpEditor
            datasets={datasets}
            originalCode={code}
            setOriginalCode={setCode}
          ></SimpEditor>
        </TabsContent>
      </Tabs>
    </>
  );
}

export default App;
