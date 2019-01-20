import { Message } from "../shared/models/message";
import { Result, Commands } from "../shared/models/enum";
import { Logger } from "../shared/services/logger.service";
import { MessageManagerService } from "../shared/services/message-manager.service";
import { ComponentTypeRepository } from "../repositories/component-type-repository";
import { ComponentType } from "../shared/models/component-type";
import { ResponsePayload } from "../shared/models/response-payload";
import { Component } from "../shared/models/component";
import { ComponentRepository } from "../repositories/component-repository";
import { KeyValue } from "../shared/models/key-value";
import { Constants } from "../shared/models/constants";

export class ComponentManager {
  moduleName = 'ComponentService/Manager';
  executeCommandTopicName = 'ComponentService/Execute_Command';

  constructor() {
  }

  /**
  * @summary handle the messages with sub topic 'Configuration'
  * @param {Message} message - the message that resieved from MQ
  * @return {Promise<Result>} Result enum wrapped in a promise.
  */
  async processMessageRequest(message: Message) {
    try {
      var command = message.topicName.replace(this.moduleName + "/", "");
      let result = Result.Failed;

      switch (command) {
        case Commands.GetComponents:
          result = await this.getComponents(message);
          break;
        case Commands.GetComponent:
          result = await this.getComponent(message);
          break;
        case Commands.GetComponentsTypes:
          result = await this.getAllComponentTypes(message);
          break;
        case Commands.GetComponentType:
          result = await this.getComponentType(message);
          break;
        case Commands.UpdateComponent:
          result = await this.updateComponent(message);
          break;
        case Commands.DeleteComponents:
          result = await this.deleteComponent(message);
          break;
        case Commands.ExecuteCommand:
          result = await this.executeCommand(message);
          break;
      }
      return result;
    } catch (error) {
      Logger.error(error);
      return Result.Failed;
    }
  }

  /**
  * @summary get list of Component
  * @param {Message} message - the message that resieved from MQ
  * @return {Promise<Result>} Result enum wrapped in a promise.
  */
  async getComponents(message: Message) {
    try {
      let componentRepo = new ComponentRepository();

      let component = new Component();
      let data = await componentRepo.getAll(component);
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

  /**
  * @summary get a one or more of Component
  * @param {Message} message - the message that resieved from MQ
  * @return {Promise<Result>} Result enum wrapped in a promise.
  */
  async getComponent(message: Message) {
    try {
      let params = await MessageManagerService.getCommonParameters(message.payload);

      let componentRepo = new ComponentRepository();
      let data = await componentRepo.get(new Component(), params);
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

  /**
    * @summary get list of Component types
    * @param {Message} message - the message that resieved from MQ
    * @return {Promise<Result>} Result enum wrapped in a promise.
    */
  async getAllComponentTypes(message: Message) {
    try {
      let componentRepo = new ComponentTypeRepository();

      let data = await componentRepo.getAll(new ComponentType());
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

  /**
  * @summary get a one or more of Component Type
  * @param {Message} message - the message that resieved from MQ
  * @return {Promise<Result>} Result enum wrapped in a promise.
  */
  async getComponentType(message: Message) {
    try {
      let params = await MessageManagerService.getCommonParameters(message.payload);

      let componentRepo = new ComponentTypeRepository();
      let data = await componentRepo.get(new ComponentType(), params);
      let payload = new ResponsePayload();

      if (data) {
        payload.data = JSON.stringify(data);
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

  /**
  * @summary update Component
  * @param {Message} message - the message that resieved from MQ
  * @return {Promise<Result>} Result enum wrapped in a promise.
  */
  async updateComponent(message: Message): Promise<Result> {
    try {
      let params = await MessageManagerService.getCommonParameters(message.payload);

      let componentRepo = new ComponentRepository();
      let result = await componentRepo.update(params);

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
   * @summary delete Component
   * @param {Message} message - the message that resieved from MQ
   * @return {Promise<Result>} Result enum wrapped in a promise.
   */
  async deleteComponent(message: Message): Promise<Result> {
    try {
      let result = Result.Failed;

      if (message.payload.componentID) {
        let params = new Array<KeyValue>();
        params.push(new KeyValue(Constants.cIDs, message.payload.componentID));

        let componentRepo = new ComponentRepository();
        result = await componentRepo.delete(params);
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
  * @summary broadcast a message to the component
  * @param {Message} message - the message that resieved from client
  * @return {Promise<Result>} Result enum wrapped in a promise.
  */
  async executeCommand(message: Message) {
    try {
      let result = await MessageManagerService.broadcastMessage(this.executeCommandTopicName, this.moduleName, message)
      let payload = new ResponsePayload();

      if (result) {
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
