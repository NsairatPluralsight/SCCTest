import { KeyValue } from "../iotcomponent/models/key-value";
import { Logger } from './logger.service';

export class MessageManagerService {

  constructor() {}

  static async getCommonParameters(payload: any, ) {
    try {
      let params = new Array<KeyValue>();
      if (payload.deviceID) {
        params.push(new KeyValue('ID', payload.deviceID));
      }
      if (payload.typeName) {
        params.push(new KeyValue('TypeName', payload.typeName));
      }
      if (payload.branchID) {
        params.push(new KeyValue('QueueBranch_ID', payload.branchID));
      }

      return params;
    } catch (error) {
      Logger.error(error);
      return null;
    }
  }

}
