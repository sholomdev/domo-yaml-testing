import domo from 'ryuu.js';
import YAML from 'yaml';
import { yamlDataset, yamlDatasetData, ymlSchema } from '.';
import { startCodeEngineFunction } from '@/lib/utils';
import { DatasetType } from '../dataset';

export const dataToYaml = (data: yamlDataset[]) => {
  const obj = {} as hashObject;

  data.forEach((row) => {
    if (!Object.prototype.hasOwnProperty.call(obj, row.DatasetID)) {
      obj[row.DatasetID] = {
        name: row.DatasetName,
        id: row.DatasetID,
        columns: [],
      };
    }
    let currentColumn = obj[row.DatasetID].columns.find(
      (column) => column.name === row.ColumnName
    );
    if (!currentColumn) {
      currentColumn = { name: row.ColumnName };
      obj[row.DatasetID].columns.push(currentColumn);
    }
    if (row.TestName !== 'none') {
      (currentColumn.tests ??= []).push(row.TestName);
    }
  });

  const sort = (a: Column, b: Column) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  };

  return YAML.stringify({ models: [...Object.values(obj)].sort(sort) });
};

export const fetchData = async () => {
  let yamlResponse: yamlDataset[];
  if (import.meta.env.DEV) {
    yamlResponse = yamlDatasetData;
  } else {
    yamlResponse = await domo.get<yamlDataset[]>('/data/v1/yaml');
  }
  return yamlResponse;
};

type Column = {
  name: string;
  id: string;
  columns: {
    name: string;
    tests?: ('unique' | 'not_null')[];
  }[];
};
type hashObject = {
  [key in string]: Column;
};

export const parsedYAMLtoCSV = (yml: ymlSchema) => {
  const lines: string[] = [];
  yml.models.forEach((model) => {
    const { id, name: datasetName } = model;
    model.columns.forEach((column) => {
      if (!column.tests) {
        lines.push(`${id},${datasetName},${column.name},none`);
      } else {
        column.tests.forEach((test) => {
          lines.push(`${id},${datasetName},${column.name},${test}`);
        });
      }
    });
  });
  return lines.join('\n');
};

export const validateYMLschema = (yml: ymlSchema) => {
  const isValid = yml.models.every(
    (model) =>
      Object.prototype.hasOwnProperty.call(model, 'name') &&
      Object.prototype.hasOwnProperty.call(model, 'id') &&
      Object.prototype.hasOwnProperty.call(model, 'columns') &&
      Array.isArray(model.columns) &&
      model.columns.every(
        (column) =>
          Object.prototype.hasOwnProperty.call(column, 'name') &&
          (!Object.prototype.hasOwnProperty.call(column, 'tests') ||
            (Object.prototype.hasOwnProperty.call(column, 'tests') &&
              Array.isArray(column.tests) &&
              column.tests.every(
                (test) => test === 'not_null' || test === 'unique'
              )))
      )
  );

  //also need to validate that all the datsets and columns are valid with live data
  if (!isValid) throw new Error('Something is wrong with the YML.');
};

const validateYMLcolumns = (parsedYaml: ymlSchema, datasets: DatasetType[]) => {
  const notFoundColumns: { model: string; name: string }[] = [];
  const isValid = parsedYaml.models.every((model) => {
    const dataset = datasets.find((current) => current.DatasetID === model.id);
    if (!dataset) throw new Error(`Dataset ${model.id} not found.`);
    return model.columns.every((column) => {
      const found = dataset?.ColumnArray?.some(
        (dastasetColumn) => dastasetColumn === column.name
      );
      !found && notFoundColumns.push({ model: model.name, name: column.name });
      return found;
    });
  });

  if (!isValid || notFoundColumns.length > 0)
    throw new Error(
      `Columns in YML not found in datasets. ${notFoundColumns
        .map((column) => `${column.model}: ${column.name}`)
        .join(', ')}`
    );
};

export const saveYaml = async (code: string, datasets: DatasetType[]) => {
  const parsedYaml = YAML.parse(code);
  validateYMLschema(parsedYaml);
  validateYMLcolumns(parsedYaml, datasets);
  const csv = parsedYAMLtoCSV(parsedYaml);
  console.log(csv);
  if (import.meta.env.DEV) {
    return true;
  }
  return await startCodeEngineFunction('uploadDataset', {
    dataset: 'a2eb5c55-ecc0-4b2d-aad2-481c952dba90',
    values: csv,
  });
};
