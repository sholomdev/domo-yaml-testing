export type yamlDataset = {
  DatasetID: string;
  DatasetName: string;
  ColumnName: string;
  TestName: 'unique' | 'not_null' | 'none';
};

export interface ymlSchema {
  models: {
    name: string;
    id: string;
    columns: {
      name: string;
      description?: string;
      tests?: ['not_null' | 'unique'];
    }[];
  }[];
}

export const yamlDatasetData: yamlDataset[] = [
  {
    DatasetID: '026fa704-5fc2-4931-8298-39237cd154bf',
    DatasetName: 'Dataflow Input Datasources',
    ColumnName: 'Dataflow ID',
    TestName: 'unique',
  },
  {
    DatasetID: '026fa704-5fc2-4931-8298-39237cd154bf',
    DatasetName: 'Dataflow Input Datasources',
    ColumnName: 'Dataflow ID',
    TestName: 'not_null',
  },
  {
    DatasetID: '026fa704-5fc2-4931-8298-39237cd154bf',
    DatasetName: 'Dataflow Input Datasources',
    ColumnName: 'Datasource Input ID',
    TestName: 'not_null',
  },
  {
    DatasetID: '026fa704-5fc2-4931-8298-39237cd154bf',
    DatasetName: 'Dataflow Input Datasources',
    ColumnName: '_BATCH_ID_',
    TestName: 'none',
  },
];
