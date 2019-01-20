import { EntryPoint } from './entryPoint';
import { expect } from 'chai';
import { stubObject } from 'ts-sinon';
import { Message } from './shared/models/message';
import { Result } from './shared/models/enum';
import rewire = require('rewire');
import { ResponsePayload } from './shared/models/response-payload';
var rabbitMQClient = require("../rabbitMQClient");

describe('Enrty Point', () => {
  let entryPoint: EntryPoint;
  let testStub: any;
  beforeEach(() => {
    entryPoint = new EntryPoint();
    //testStub = stubObject<EntryPoint>(entryPoint, ['sendToModule', 'getModuleName']);
    testStub = stubObject<EntryPoint>(entryPoint, {
      sendToModule: async (payload: any, topic: string, moduleName: string, reply: Array<any>) => {
        let message = new Message('sendToModule/test');
        message.payload = new ResponsePayload();
        message.payload.result = Result.Success;
        reply.push(JSON.stringify(message));
        return Result.Success;
      },
      getModuleName: 'target' });
    //var testStub = stubObject(rabbitMQClient, '');
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

  describe('loadEntities', () => {
    it('should return success', async () => {
      let message = new Message('loadEntities/test');
      let payload = {
        target: "QueueBranch.GetEntitiesNames",
      };
      message.payload = payload;

      // testStub.sendToModule.returns(Result.Success);
      // testStub.getModuleName.returns("target");
      // console.log(entryPoint);

      let result = await testStub.loadEntities(message);
      expect(result).to.equal(Result.Success);

      // expect(testStub.sendToModule()).to.have.been;
      // expect(testStub.getModuleName()).to.equal("target");
    });
  });

});
