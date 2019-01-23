import { Commands, Result, PropertyType } from '../shared/models/enum';
import { Logger } from '../shared/services/logger.service';
import { ComponentRepository } from '../repositories/component-repository';
import { ResponsePayload } from '../shared/models/response-payload';
import { Message } from '../shared/models/message';
import { JsonValidator } from '../shared/services/json.validator.service';
import { MessageManagerService } from '../shared/services/message-manager.service';
import { KeyValue } from '../shared/models/key-value';
import { Constants } from '../shared/models/constants';
import { Component } from '../shared/models/component';

export class ReportsService {
  moduleName = "ComponentService/Report";
  broadcastTopic = "ComponentService.broadcast";
  reportTopicName = 'ComponentService/Component_Report_Changed';

  /**
  * @summary handle the messages with sub topic 'Report'
  * @param {Message} message - the message that resieved from MQ with sub topic name 'Report'
  * @return {Promise<Result>} Result enum wrapped in a promise.
  */
  async processMessageRequest(message: Message): Promise<Result> {
    try {
      var command = message.topicName.replace(this.moduleName + "/", "");
      let result = Result.Failed;

      switch (command) {
        case Commands.SetReport:
          result = await this.setReport(message);
          break;
        case Commands.GetReport:
          result = await this.getReport(message);
          break;
      }
      return result;
    } catch (error) {
      Logger.error(error);
      return Result.Failed;
    }
  }

  /**
  * @summary set Component reported data
  * @param {Message} message - the message that resieved from MQ with sub topic name 'Report'
  * @return {Promise<Result>} Result enum wrapped in a promise.
  */
  async setReport(message: Message): Promise<Result> {
    try {
      let params = await MessageManagerService.getCommonParameters(message.payload);

      if (message.payload.data) {
        params.push(new KeyValue(Constants.cREPORTED_DATA, message.payload.data));
      }

      let validator = new JsonValidator();
      let isValid = await validator.validate(JSON.parse(message.payload.data), message.payload.typeName, PropertyType.ReportedData);

      let result = Result.Failed;
      if (isValid) {
        let componentRepo = new ComponentRepository();
        result = await componentRepo.updateReport(params);

        if (result == Result.Success) {
          MessageManagerService.broadcastMessage(this.reportTopicName, this.moduleName, message);
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
  * @summary get Component reported data
  * @param {Message} message - the message that resieved from MQ with sub topic name 'Report'
  * @return {Promise<Result>} Result enum wrapped in a promise.
  */
  async getReport(message: Message): Promise<Result> {
    try {
      let params = await MessageManagerService.getCommonParameters(message.payload);

      let componentRepo = new ComponentRepository();
      let data = await componentRepo.getColumn(new Component(), params, Constants.cREPORTED_DATA.toLowerCase());
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
