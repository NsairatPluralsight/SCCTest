import { expect } from 'chai';
import * as sinon from 'ts-sinon';
import * as fs from 'fs-extra';
import { JsonValidator } from './json.validator.service';
import { PropertyType } from '../models/enum';
import { ComponentTypeRepository } from '../../repositories/component-type-repository';

describe('Json Validator', () => {

  describe('validate', () => {
    let stubDB;
    beforeEach(() => {
      let componentType = {
        configurationSchema: '{"title": "CounterLCD Configuration","description": "A Configuration that belongs to CounterLCD which is part of the IoT Components","type": "object","properties": {"counterID": {"description": "The counterId that belongs to this IoT","type": "integer"}},"additionalProperties": false,"required": [ "counterID" ]}'
      };

        stubDB = sinon.default.stub(ComponentTypeRepository.prototype, 'get').returns(componentType);
    });

    afterEach(() => {
      stubDB.restore();
    });

    it('should return true', async () => {
      let config = JSON.parse('{"counterID":131}');

      let jsonValidator = new JsonValidator();

      let result = await jsonValidator.validate(config, 'CounterLCD', PropertyType.Configuration);

      expect(result).to.equal(true);
    });

    it('should return false', async () => {
      let config = JSON.parse('{"counternumber":131}');

      let jsonValidator = new JsonValidator();

      let result = await jsonValidator.validate(config, 'CounterLCD', PropertyType.Configuration);

      expect(result).to.equal(false);
    });

  });

  describe('isValid', () => {
    let component;
    let scmeaPath = '/../../resources/component-schema.json';

    beforeEach(() => {
      let jsonComponent = '{"orgID":1,"typeName":"CounterLCD","name_L1":"test3","name_L2":"test3","queueBranch_ID":115,"identity":"CounterLCDtest3","address":"test3"}';
      component = JSON.parse(jsonComponent);
    });

    it('should return true', async () => {
      let schema = await fs.readJSONSync(__dirname + scmeaPath);
      let jsonValidator = new JsonValidator();

      let result = await jsonValidator.isValid(component, schema);

      expect(result).to.equal(true);
    });

    it('should return false', async () => {
      component = {
        name_L1: 'test Comp'
      };
      let schema = await fs.readJSONSync(__dirname + scmeaPath);
      let jsonValidator = new JsonValidator();

      let result = await jsonValidator.isValid(component, schema);

      expect(result).to.equal(false);
    });
  });

});
