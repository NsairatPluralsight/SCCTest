import { Logger } from './logger.service';
import { KeyValue } from "../models/key-value";
import { EventsService } from '../models/event';
import { Message } from '../models/message';
import { Constants } from '../models/constants';
import { EventEmitter } from 'events';

export class MessageManagerService {
  static broadcastTopic = 'ComponentService.broadcast';
  static eventTest = new EventEmitter();

  constructor() { }

/**
* @summary extracts the parameters from payload
* @param {any} payload - the payload that resieved from client
* @return {Promise<KeyValue>} - paramters as KeyValue wrapped in a promise.
*/
  static async getCommonParameters(payload: any): Promise<KeyValue[]> {
    try {
      let params = new Array<KeyValue>();
      if (payload.componentID) {
        params.push(new KeyValue(Constants.cID, payload.componentID));
      }
      if (payload.typeName) {
        params.push(new KeyValue(Constants.cTYPE_NAME, payload.typeName));
      }
      if (payload.branchID) {
        params.push(new KeyValue(Constants.cQUEUE_BRANCH_ID, payload.branchID));
      }
      if (payload.description) {
        params.push(new KeyValue(Constants.cDESCRIPTION, payload.description));
      }
      if (payload.name_L1) {
        params.push(new KeyValue(Constants.cNAME_L1, payload.name_L1));
        params.push(new KeyValue(Constants.cNAME_L2, payload.name_L2));
        params.push(new KeyValue(Constants.cNAME_L3, payload.name_L3));
        params.push(new KeyValue(Constants.cNAME_L4, payload.name_L4));
      }

      return params;
    } catch (error) {
      Logger.error(error);
      return null;
    }
  }

/**
* @summary broadcast a message on the Component
* @param {string} topic - the message topic to broadcast on
* @param {string} moduleName - the module name that sent the broadcast
* @param {Message} message - the message that resieved from client
* @return {Promise<boolean>} - boolean wrapped in a promise.
*/
  static async broadcastMessage(topic: string, moduleName: string, message: Message) {
    try {
      let broadcastMessage = new Message(moduleName);
      broadcastMessage.payload = message.payload;
      broadcastMessage.topicName = topic;

      let result = EventsService.broadcastMessage.emit(Constants.cEVENT, this.broadcastTopic, broadcastMessage);

      return result;
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }

}
