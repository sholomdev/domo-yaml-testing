import domo from 'ryuu.js';
import { DatasetType, datasetData } from '.';

export const fetchDatasets = async () => {
  let datasetResponse: DatasetType[];

  if (import.meta.env.DEV) {
    datasetResponse = datasetData;
  } else {
    datasetResponse = await domo.get<DatasetType[]>('/data/v1/Datasets');
  }
  const dataWithColumnArray = datasetResponse.map((row) => {
    const ColumnArray = row.Columns.split(', ');
    return {
      ...row,
      ColumnArray,
    };
  });

  return dataWithColumnArray;
};
