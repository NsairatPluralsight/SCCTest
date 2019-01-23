import { EntryPoint } from './entryPoint';
import { expect } from 'chai';
import * as sinon from 'ts-sinon';
import { Message } from './shared/models/message';
import { Result } from './shared/models/enum';
import { ResponsePayload } from './shared/models/response-payload';
import { Logger } from './shared/services/logger.service';
import { describe } from 'mocha';
import { EventsService } from './shared/models/event';
var rabbitMQClient = require("../rabbitMQClient");

describe('Enrty Point', () => {
  let entryPoint: EntryPoint;
  let receiveStub, eventService;
  let sandbox = sinon.default.sandbox.create();

  beforeEach(() => {
    entryPoint = new EntryPoint();

    sandbox.stub(Logger, 'error').callsFake(() => {
      return {}
    });
    receiveStub = sandbox.stub(rabbitMQClient.prototype, 'receive').callsFake(() => { sandbox.spy() } );
    sandbox.stub(rabbitMQClient.prototype, 'sendBroadcast').callsFake(() => { return Result.Success } );
    sandbox.stub(rabbitMQClient.prototype, 'send').callsFake(() => { return Result.Success } );

    eventService = sandbox.stub(EventsService.broadcastMessage, 'on').callsFake(() => { sandbox.spy() } );
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('start', () => {

    it('should call two methods', async () => {
      await entryPoint.start();

      expect(receiveStub.calledOnce).to.equal(true);
      expect(eventService.calledOnce).to.equal(true);
    });

  });

  describe('processRequest', () => {

    it('should return failed', async () => {
      let result = await entryPoint.processRequest(new Message('test/processRequest'), new Message('test/replay/processRequest'));

      expect(result).to.equal(Result.Failed);
    });

    it('should return Success', async () => {
      let message = new Message('loadEntities/test');
      let payload = {
        target: "QueueBranch.GetEntitiesNames",
      };
      message.payload = payload;
      message.topicName = 'ComponentService/Data';

      sandbox.stub(entryPoint, 'sendToModule').callsFake(async (payload: any, topic: string, moduleName: string, reply: Array<any>) => {
        let message = new Message('sendToModule/test');
        message.payload = new ResponsePayload();
        message.payload.result = Result.Success;
        reply.push(JSON.stringify(message));
        return Result.Success;
      });

      let result = await entryPoint.processRequest(message, new Message('test/replay/processRequest'));

      expect(result).to.equal(Result.Success);
    });


  });

  describe('broadcastMessage', () => {

    it('should return success', async () => {
      let result = await entryPoint.broadcastMessage('test/broadcastMessage', new Message('test/broadcastMessage'));

      expect(result).to.equal(Result.Success);
    });

  });

  describe('sendToModule', () => {

    it('should return success', async () => {
      let replay: Array<any>;
      let result = await entryPoint.sendToModule('test', 'test/sendToModule', 'entryPointTest',  replay);

      expect(result).to.equal(Result.Success);
    });

  });

  describe('loadEntities', () => {

    it('should return Failed', async () => {
      let message = new Message('test/loadEntities');

      let result = await entryPoint.loadEntities(message);

      expect(result).to.equal(Result.Failed);
    });

    it('should return success', async () => {
      let message = new Message('loadEntities/test');
      let payload = {
        target: "QueueBranch.GetEntitiesNames",
      };
      message.payload = payload;

      sandbox.stub(entryPoint, 'sendToModule').callsFake(async (payload: any, topic: string, moduleName: string, reply: Array<any>) => {
        let message = new Message('sendToModule/test');
        message.payload = new ResponsePayload();
        message.payload.result = Result.Success;
        reply.push(JSON.stringify(message));
        return Result.Success;
      });

      let result = await entryPoint.loadEntities(message);

      expect(result).to.equal(Result.Success);
    });

  });

  describe('getModuleName', () => {

    it('should Return Module Name', () => {
      let result = entryPoint.getModuleName("QueueBranch.GetEntitiesNames");

      expect(result).to.equal("CVMServer/QueueBranch");
    });

    it('should Return undefined', () => {
      let result = entryPoint.getModuleName("QueueBranch.GetEntitiesNames");

      expect(result).to.equal("CVMServer/QueueBranch");
    });
  });

  describe('getSourceID', () => {

    it('get Source ID', () => {
      let result = entryPoint.getSourceID();

      expect(result).not.equal(null);
    });
  });

});
