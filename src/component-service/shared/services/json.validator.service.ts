var AJV = require('ajv');
import { Logger } from './logger.service';
import { ComponentTypeRepository } from '../../repositories/component-type-repository';
import { ComponentType } from '../models/component-type';
import { KeyValue } from '../models/key-value';
import { PropertyType } from '../models/enum';

export class JsonValidator {

  constructor() { }

  async validate(object: any, type: string, propertyType: PropertyType) {
    try {
      let params = new Array<KeyValue>();
      params.push(new KeyValue('TypeName', type));

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

  async isValid(entity: any, schema: any): Promise<boolean> {
    try {
      let ajv = new AJV({
        version: 'draft-06',
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
