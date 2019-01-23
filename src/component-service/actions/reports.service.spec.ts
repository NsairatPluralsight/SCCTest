import { expect } from 'chai';
import * as sinon from 'ts-sinon';
import { Logger } from '../shared/services/logger.service';
import { MessageManagerService } from '../shared/services/message-manager.service';
import { JsonValidator } from '../shared/services/json.validator.service';
import { ComponentRepository } from '../repositories/component-repository';
import { Result } from '../shared/models/enum';
import { ReportsService } from './reports.service';
import { Message } from '../shared/models/message';
import {RequestPayload} from '../shared/models/request-payload';
import { KeyValue } from '../shared/models/key-value';

describe('Reports Service', () => {
  let sandbox = sinon.default.sandbox.create();
  let getCommonParametersStub, broadcastMessageStub, jsonValidatorStub, componentRepositoryStub;

  beforeEach(() => {
    sandbox.stub(Logger, 'error').callsFake(() => {
      return {}
    });

    getCommonParametersStub = sandbox.stub(MessageManagerService, 'getCommonParameters').callsFake(() => { return new Array<KeyValue>() });
    broadcastMessageStub = sandbox.stub(MessageManagerService, 'broadcastMessage').callsFake(() => { sandbox.spy() });

    jsonValidatorStub = sandbox.stub(JsonValidator.prototype);
    jsonValidatorStub.validate.callsFake(() => { return true; });

    componentRepositoryStub = sandbox.stub(ComponentRepository.prototype);
    componentRepositoryStub.updateReport.callsFake(() => { return Result.Success; });
    componentRepositoryStub.getColumn.callsFake(() => { return '{"Status", "live"}'; });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('processMessageRequest', () => {

    it('should return Failed',  async () => {
      let message = new Message('test report service');
      message.topicName = 'test/Failed';

      let reportsService = new ReportsService();

      let result = await reportsService.processMessageRequest(message);

      expect(result).to.equal(Result.Failed);
     });

     it('should return success',  async () => {
      let message = new Message('test report service');
      message.topicName = 'ComponentService/Report/SetReport';
      message.payload = new RequestPayload();
      message.payload.data = '{"counterID":131}';

      let reportsService = new ReportsService();

      let result = await reportsService.processMessageRequest(message);

      expect(result).to.equal(Result.Success);
     });
  });

  describe('setReport', () => {

    it('should call one methods and return success',  async () => {
      let reportsService = new ReportsService();
      let message = new Message('test report service');
      message.payload = new RequestPayload();
      message.payload.data = '{"counterID":131}';

      let result = await reportsService.setReport(message);

      expect(broadcastMessageStub.calledOnce).to.equal(true);
      expect(result).to.equal(Result.Success);
     });

     it('should return failed',  async () => {
      let reportsService = new ReportsService();
      let message = new Message('test report service');
      message.payload = new RequestPayload();

      let result = await reportsService.setReport(message);

      expect(broadcastMessageStub.calledOnce).to.equal(false);
      expect(result).to.equal(Result.Failed);
     });
  });

  describe('getReport', () => {

    it('should return success',  async () => {
     let reportsService = new ReportsService();
     let message = new Message('test report service');

     let result = await reportsService.getReport(message);

     expect(result).to.equal(Result.Success);
    });

    it('should return failed',  async () => {
      let reportsService = new ReportsService();
      let message = new Message('test report service');
      componentRepositoryStub.getColumn.callsFake(() => { return null; });

      let result = await reportsService.getReport(message);

      expect(getCommonParametersStub.calledOnce).to.equal(true);
      expect(result).to.equal(Result.Failed);
     });

  });
});
