import { Commands, Result, PropertyType } from '../shared/models/enum';
import { Logger } from '../shared/services/logger.service';
import { ComponentRepository } from '../repositories/component-repository';
import { ResponsePayload } from '../shared/models/response-payload';
import { Message } from '../shared/models/message';
import { JsonValidator } from '../shared/services/json.validator.service';
import { MessageManagerService } from '../shared/services/message-manager.service';
import { KeyValue } from '../shared/models/key-value';
import { Component } from '../shared/models/component';
import { Constants } from '../shared/models/constants';

export class ConfigurationService {
  moduleName = 'ComponentService/Configuration';
  configurationTopicName = 'ComponentService/component_Configuration_Changed';

  constructor() {
  }

  /**
  * @summary handle the messages with sub topic 'Configuration'
  * @param {Message} message - the message that resieved from MQ with sub topic name 'Configuration'
  * @return {Promise<Result>} Result enum wrapped in a promise.
  */
  async processMessageRequest(message: Message): Promise<Result> {
    try {
      var command = message.topicName.replace(this.moduleName + "/", "");
      let result = Result.Failed;

      switch (command) {
        case Commands.SetConfig:
          result = await this.setConfig(message);
          break;
        case Commands.GetConfig:
          result = await this.getConfig(message);
          break;
      }
      return result;
    } catch (error) {
      Logger.error(error);
      return Result.Failed;
    }
  }

  /**
  * @summary set Component config
  * @param {Message} message - the message that resieved from MQ with sub topic name 'Configuration'
  * @return {Promise<Result>} Result enum wrapped in a promise.
  */
  async setConfig(message: Message): Promise<Result> {
    try {
      let params = await MessageManagerService.getCommonParameters(message.payload);
      if (message.payload.data) {
        params.push(new KeyValue(Constants.cCONFIGURATION, message.payload.data));
      }

      let validator = new JsonValidator();
      let isValid = await validator.validate(JSON.parse(message.payload.data), message.payload.typeName, PropertyType.Configuration);

      let result = Result.Failed;
      if (isValid) {
        let componentRepo = new ComponentRepository();
        result = await componentRepo.updateConfig(params);

        if (result == Result.Success) {
          MessageManagerService.broadcastMessage(this.configurationTopicName, this.moduleName, message);
        }
      }

      let payload = new ResponsePayload();
      payload.result = result;
      message.payload = payload;
      return result;
    } catch (error) {
      Logger.error(error);
      return Result.Failed;
    }
  }

  /**
  * @summary get Component config
  * @param {Message} message - the message that resieved from MQ with sub topic name 'Configuration'
  * @return {Promise<Result>} Result enum wrapped in a promise.
  */
  async getConfig(message: Message): Promise<Result> {
    try {
      let params = await MessageManagerService.getCommonParameters(message.payload);

      let componentRepo = new ComponentRepository();
      let data = await componentRepo.getColumn(new Component(), params, Constants.cCONFIGURATION.toLowerCase());
      let payload = new ResponsePayload();

      if (data) {
        payload.data = data;
        payload.result = Result.Success;
      } else {
        payload.result = Result.Failed
      }
      message.payload = payload;

      return message.payload.result;
    } catch (error) {
      Logger.error(error);
      return Result.Failed;
    }
  }
}
