import { expect } from 'chai';
import * as sinon from 'ts-sinon';
import { Logger } from '../shared/services/logger.service';
import { MessageManagerService } from '../shared/services/message-manager.service';
import { ComponentRepository } from '../repositories/component-repository';
import { Result } from '../shared/models/enum';
import { Message } from '../shared/models/message';
import { KeyValue } from '../shared/models/key-value';
import { ComponentManager } from './component-manager.service';
import { ComponentTypeRepository } from '../repositories/component-type-repository';

describe('Component Manager', () => {
  let sandbox = sinon.default.sandbox.create();
  let getCommonParametersStub, broadcastMessageStub, componentRepositoryStub, componentTypeRepositoryStub;

  beforeEach(() => {
    sandbox.stub(Logger, 'error').callsFake(() => {
      return {}
    });

    getCommonParametersStub = sandbox.stub(MessageManagerService, 'getCommonParameters').callsFake(() => { return new Array<KeyValue>() });
    componentRepositoryStub = sandbox.stub(ComponentRepository.prototype);
    componentTypeRepositoryStub = sandbox.stub(ComponentTypeRepository.prototype);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('processMessageRequest', () => {

    it('should return failed', async () => {
      let componentManager = new ComponentManager();

      let result = await componentManager.processMessageRequest(new Message('test/processMessageRequest'));

      expect(result).to.equal(Result.Failed);
    });

    it('should return Success', async () => {
      let message = new Message('test/processMessageRequest')
      message.topicName = 'ComponentService/Manager/GetComponents';
      componentRepositoryStub.getAll.callsFake(() => { return '{"Dumy", "object"}'; });

      let componentManager = new ComponentManager();
      let result = await componentManager.processMessageRequest(message);

      expect(result).to.equal(Result.Success);
    });

  });

  describe('getComponents', () => {

    it('should return Success', async () => {
      let componentManager = new ComponentManager();

      componentRepositoryStub.getAll.callsFake(() => { return '{"Dumy", "object"}'; });

      let result = await componentManager.getComponents(new Message('test/getComponents'));

      expect(result).to.equal(Result.Success);
    });

    it('should return failed', async () => {
      let componentManager = new ComponentManager();

      componentRepositoryStub.getAll.callsFake(() => { return null; });

      let result = await componentManager.getComponents(new Message('test/getComponents'));

      expect(result).to.equal(Result.Failed);
    });

  });

  describe('getComponent', () => {

    it('should return Success', async () => {
      let componentManager = new ComponentManager();

      componentRepositoryStub.get.callsFake(() => { return '{"Dumy", "object"}'; });

      let result = await componentManager.getComponent(new Message('test/getComponent'));

      expect(result).to.equal(Result.Success);
      expect(getCommonParametersStub.calledOnce).to.equal(true);
    });

    it('should return failed', async () => {
      let componentManager = new ComponentManager();

      componentRepositoryStub.get.callsFake(() => { return null; });

      let result = await componentManager.getComponent(new Message('test/getComponent'));

      expect(result).to.equal(Result.Failed);
      expect(getCommonParametersStub.calledOnce).to.equal(true);
    });

  });

  describe('getAllComponentTypes', () => {

    it('should return Success', async () => {
      let componentManager = new ComponentManager();

      componentTypeRepositoryStub.getAll.callsFake(() => { return '{"Dumy", "object"}'; });

      let result = await componentManager.getAllComponentTypes(new Message('test/getAllComponentTypes'));

      expect(result).to.equal(Result.Success);
    });

    it('should return failed', async () => {
      let componentManager = new ComponentManager();

      componentTypeRepositoryStub.getAll.callsFake(() => { return null });

      let result = await componentManager.getAllComponentTypes(new Message('test/getAllComponentTypes'));

      expect(result).to.equal(Result.Failed);
    });

  });

  describe('getComponentType', () => {

    it('should return Success', async () => {
      let componentManager = new ComponentManager();

      componentTypeRepositoryStub.get.callsFake(() => { return '{"Dumy", "object"}'; });

      let result = await componentManager.getComponentType(new Message('test/getComponentType'));

      expect(result).to.equal(Result.Success);
      expect(getCommonParametersStub.calledOnce).to.equal(true);
    });

    it('should return failed', async () => {
      let componentManager = new ComponentManager();

      componentTypeRepositoryStub.get.callsFake(() => { return null });

      let result = await componentManager.getComponentType(new Message('test/getComponentType'));

      expect(result).to.equal(Result.Failed);
      expect(getCommonParametersStub.calledOnce).to.equal(true);
    });

  });

  describe('updateComponent', () => {

    beforeEach(() => {
      componentRepositoryStub.update.callsFake(() => { return Result.Success; });
    });

    it('should return Success', async () => {
      let componentManager = new ComponentManager();

      let result = await componentManager.updateComponent(new Message('test/updateComponent'));

      expect(result).to.equal(Result.Success);
    });

    it('should call getCommonParametersStub', async () => {
      let componentManager = new ComponentManager();

      let result = await componentManager.updateComponent(new Message('test/updateComponent'));

      expect(getCommonParametersStub.calledOnce).to.equal(true);
    });

  });

  describe('delete Component', () => {

    beforeEach(() => {
      componentRepositoryStub.delete.callsFake(() => { return Result.Success; });
    });

    it('should return Success',  async () => {
      let message = new Message('test/deleteComponent');
      message.payload = {
        componentID: 1
      };

      let componentManager = new ComponentManager();

      let result = await componentManager.deleteComponent(message);

      expect(result).to.equal(Result.Success);
    });

    it('should return Failed',  async () => {
      let componentManager = new ComponentManager();

      let result = await componentManager.deleteComponent(new Message('test/deleteComponent'));

      expect(result).to.equal(Result.Failed);
    });

  });

  describe('execute Command', () => {

    beforeEach(() => {
      broadcastMessageStub = sandbox.stub(MessageManagerService, 'broadcastMessage').callsFake(() => { sandbox.spy() });
    });

    it('should call broadcastMessage once', async () => {
      let componentManager = new ComponentManager();

      await componentManager.executeCommand(new Message('test/executeCommand'));

      expect(broadcastMessageStub.calledOnce).to.equal(true);
    });

    it('should call return failed', async () => {
      let componentManager = new ComponentManager();

      let result = await componentManager.executeCommand(new Message('test/executeCommand'));

      expect(result).to.equal(Result.Failed);
    });

  });

});
