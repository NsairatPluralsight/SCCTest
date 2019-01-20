export class ComponentType {
  id: number;
  typeName: string;
  captionKey: string;
  configurationSchema: string;
  reportedDataSchema: string;
  CreationTime: any;
  LastUpdateTime: any;

  constructor() {
    this.id = -1;
    this.typeName = '';
    this.captionKey = '';
    this.configurationSchema = '';
    this.reportedDataSchema = '';
    this.CreationTime = new Date();
    this.LastUpdateTime = new Date();
  }
}




