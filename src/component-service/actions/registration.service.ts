import { Result } from '../shared/models/enum';
import { Logger } from '../shared/services/logger.service';
import { ComponentRepository } from '../repositories/component-repository';
import { Component } from '../shared/models/component';
import { ResponsePayload } from '../shared/models/response-payload';
import { Message } from '../shared/models/message';
import * as fs from 'fs-extra';
import { JsonValidator } from '../shared/services/json.validator.service';

export class RegistrationService {
  moduleName = "ComponentService/Registration";
  schemaPath = '/../resources/component-schema.json';

  /**
* @summary handle the messages with sub topic 'Registration'
* @param {Message} message - the message that resieved from MQ with sub topic name 'Registration'
* @return {Promise<Result>} Result enum wrapped in a promise.
*/
  async registerComponent(message: Message): Promise<Result> {
    try {
      let result = await this.addComponent(message);
      return result;
    } catch (error) {
      Logger.error(error);
      return Result.Failed;
    }
  }

/**
* @async
* @summary Add new Component based on the data in message
* @param {Message} message - the message that resieved from MQ with sub topic name 'Registration'
* @return {Promise<Result>} Result enum wrapped in a promise.
*/
  async addComponent(message: Message): Promise<Result> {
    try {
      let component = JSON.parse(message.payload.data);

      let checkResult = await this.checkComponent(component);
      let result = Result.Failed;
      if (checkResult) {
        let tComponent = new Component();
        tComponent.orgID = component.orgID;
        tComponent.typeName = component.typeName;
        tComponent.name_L1 = component.name_L1;
        tComponent.name_L2 = component.name_L2;
        tComponent.name_L3 = component.name_L3;
        tComponent.name_L4 = component.name_L4;
        tComponent.queueBranch_ID = component.queueBranch_ID;
        if (component.relatedClassName) {
          tComponent.relatedClassName = component.className;
          tComponent.relatedObject_ID = component.relatedObject_ID;
        }
        tComponent.identity = component.identity;
        tComponent.address = component.address;

        let componentRepo = new ComponentRepository();
        result = await componentRepo.create(tComponent);
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
* @async
* @summary check if the new component is valid accourding to the schema
* @param {any} component - the component object to register resieved from MQ
* @return {Promise<boolean>} Result enum wrapped in a promise.
*/
  async checkComponent(component: any): Promise<boolean> {
    try {
      let componentSchema = await this.getSchema();

      let isValid = false;
      if (componentSchema && component) {
        let validator = new JsonValidator();
        isValid = await validator.isValid(component, componentSchema);
      }

      return isValid;
    } catch (error) {
      Logger.error(error);
    }
  }

/**
* @async
* @summary get the component schema from file
* @return {Promise<any>} Schema as any wrapped in a promise.
*/
  private async getSchema(): Promise<any> {
    try {
      let schema = await fs.readJSONSync(__dirname + this.schemaPath);
      return schema;
    } catch (error) {
      Logger.error(error);
      return null;
    }
  }
}
