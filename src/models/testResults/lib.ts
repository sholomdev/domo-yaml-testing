import domo from 'ryuu.js';
import { TestResultType, TestResultData } from '.';

export type TestMapType = {
  [key: string]: {
    [key: string]: {
      [key: string]: {
        [key: string]: string;
      };
    };
  };
};

export const fetchTestResults = async () => {
  let testData: TestResultType[];

  if (import.meta.env.DEV) {
    testData = TestResultData;
  } else {
    testData = await domo.get<TestResultType[]>('/data/v1/TestResults');
  }

  const testMap = {} as TestMapType;
  testData.forEach((testResult) => {
    const { DatasetID, ColumnName, TestName, Date, Result } = testResult;
    testMap[DatasetID] ??= {};
    testMap[DatasetID][ColumnName] ??= {};
    testMap[DatasetID][ColumnName][TestName] ??= {};
    testMap[DatasetID][ColumnName][TestName][Date] = Result;

    testMap[testResult.DatasetID][testResult.ColumnName][testResult.TestName][
      testResult.Date.toString()
    ] = testResult.Result;
  });
  return { testData, testMap };
};
