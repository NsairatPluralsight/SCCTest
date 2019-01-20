export enum Commands {
  SetConfig = 'SetConfig',
  GetConfig = 'GetConfig',
  SetReport = 'SetReport',
  GetReport = 'GetReport',
  GetComponents = 'GetComponents',
  GetComponent = 'GetComponent',
  GetComponentsTypes = 'GetComponentsTypes',
  GetComponentType = 'GetComponentType',
  UpdateComponent = 'UpdateComponent',
  DeleteComponents = 'DeleteComponents',
  ExecuteCommand= 'ExecuteCommand'
};

export enum Result {
  Success= 0,
  Failed= -1
};

export enum PropertyType {
  Configuration,
  ReportedData
}
