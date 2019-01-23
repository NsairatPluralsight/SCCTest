var AJV = require('ajv');
import { Logger } from './logger.service';
import { ComponentTypeRepository } from '../../repositories/component-type-repository';
import { ComponentType } from '../models/component-type';
import { KeyValue } from '../models/key-value';
import { PropertyType } from '../models/enum';
import { Constants } from '../models/constants';

export class JsonValidator {
  validatorVersion = 'draft-06';
  constructor() { }

  /**
   * @async
   * @summary - validate thee configuration or reportedData object
   * @param {any} object - the object you want to validate configuration or reported data
   * @param {string} type - the type value
   * @param {PropertyType} propertyType - the type to validate
   * @returns {Promise<boolean>} - boolean wrapped in a promise.
   */
  async validate(object: any, type: string, propertyType: PropertyType): Promise<boolean> {
    try {
      let params = new Array<KeyValue>();
      params.push(new KeyValue(Constants.cTYPE_NAME, type));

      let typeRepo = new ComponentTypeRepository();
      let componentType = new ComponentType();
      let result = await typeRepo.get(componentType, params);

      if (result) {

        let schema = '';

        switch (propertyType) {
          case PropertyType.Configuration:
            schema = JSON.parse(result.configurationSchema)
            break;
          case PropertyType.ReportedData:
            schema = JSON.parse(result.reportedDataSchema);
            break;
          default:
            break;
        }

        let isValid = await this.isValid(object, schema);

        return isValid;
      } else {
        return false;
      }
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }

  /**
   * @async
   * @summary - returns whether the object is valid or not accourding to the schema
   * @param {any} entity - the object you want to validate
   * @param {any} schema - the schema to validate the object
   * @returns {Promise<boolean>} - boolean wrapped in a promise.
   */
  async isValid(entity: any, schema: any): Promise<boolean> {
    try {
      let ajv = new AJV({
        version: this.validatorVersion,
        allErrors: true
      });

      let validate = ajv.compile(schema);
      let valid = validate(entity);

      if (!valid) {
        console.log(validate.errors);
      }

      return valid
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }
}
