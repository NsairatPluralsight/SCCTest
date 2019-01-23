import { expect } from 'chai';
import * as sinon from 'ts-sinon';
import { Logger } from '../shared/services/logger.service';
import { JsonValidator } from '../shared/services/json.validator.service';
import { ComponentRepository } from '../repositories/component-repository';
import { Result } from '../shared/models/enum';
import { Message } from '../shared/models/message';
import { RequestPayload } from '../shared/models/request-payload';
import { RegistrationService } from './registration.service';

describe('Registration Service', () => {
  let sandbox = sinon.default.sandbox.create();
  let jsonValidatorStub, componentRepositoryStub, component;

  beforeEach(() => {
    sandbox.stub(Logger, 'error').callsFake(() => {
      return {}
    });

    jsonValidatorStub = sandbox.stub(JsonValidator.prototype);
    jsonValidatorStub.isValid.callsFake(() => { return true; });

    componentRepositoryStub = sandbox.stub(ComponentRepository.prototype);
    componentRepositoryStub.create.callsFake(() => { return Result.Success; });

    component = '{"orgID":1,"typeName":"CounterLCD","name_L1":"register new test","name_L2":"register new test","queueBranch_ID":115,"identity":"CounterLCDregister new test","address":"register new test"}';
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('registerComponent', () => {

    it('should return Success',  async () => {
      let message =  new Message('test/AddComponent');
      message.payload = new RequestPayload();
      message.payload.data = component;

      let registration = new RegistrationService();

      let result = await registration.registerComponent(message);

      expect(result).to.equal(Result.Success);
    });

    it('should return Failed',  async () => {
      let message =  new Message('test/AddComponent');
      message.payload = new RequestPayload();

      let registration = new RegistrationService();

      let result = await registration.registerComponent(message);

      expect(result).to.equal(Result.Failed);
    });

  });

  describe('addComponent', () => {

    it('should return Success',  async () => {
      let message =  new Message('test/AddComponent');
      message.payload = new RequestPayload();
      message.payload.data = component;

      let registration = new RegistrationService();

      let result = await registration.addComponent(message);

      expect(result).to.equal(Result.Success);
    });

    it('should return Failed',  async () => {
      let message =  new Message('test/AddComponent');
      message.payload = new RequestPayload();

      let registration = new RegistrationService();

      let result = await registration.addComponent(message);

      expect(result).to.equal(Result.Failed);
    });

  });

  describe('checkComponent', () => {

    it('should return true',  async () => {
      let newComponent = JSON.parse(component);
      let registration = new RegistrationService();

      let isValid = await registration.checkComponent(newComponent);

      expect(isValid).to.equal(true);
    });

    it('should return false',  async () => {
      let newComponent = JSON.parse(component);
      let registration = new RegistrationService();

      registration.schemaPath = '';
      let isValid = await registration.checkComponent(newComponent);

      expect(isValid).to.equal(false);
    });

  });

});
