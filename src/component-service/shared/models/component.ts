export class Component {
  id: number;
  orgID: number;
  typeName: string;
  name_L1: string;
  name_L2: string;
  name_L3: string;
  name_L4: string;
  queueBranch_ID: number;
  reportedData: string;
  configuration: string;
  relatedClassName: string;
  relatedObject_ID: number;
  identity: string;
  address: string;
  description: string;
  CreationTime: any;
  LastUpdateTime: any;

  constructor() {
    this.id = -1;
    this.orgID = -1;
    this.typeName = '';
    this.name_L1 = '';
    this.name_L2 = '';
    this.name_L3 = '';
    this.name_L4 = '';
    this.queueBranch_ID = -1;
    this.reportedData = '';
    this.configuration = '';
    this.relatedClassName = '';
    this.relatedObject_ID = -1;
    this.identity = '';
    this.address = '';
    this.description = '';
    this.CreationTime = new Date();
    this.LastUpdateTime = new Date();
  }
}
