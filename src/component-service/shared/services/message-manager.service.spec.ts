import { expect } from 'chai';
import * as sinon from 'ts-sinon';
import { Logger } from './logger.service';
import { MessageManagerService } from './message-manager.service';
import { Message } from '../models/message';
import { EventsService } from '../models/event';

describe('message manager service', () => {
  let sandbox = sinon.default.sandbox.create();

  beforeEach(() => {
      sandbox.stub(Logger, 'error').callsFake(() => {
        return {}
      });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getCommonParameters', () => {
    it('should Return two parameters', async () => {
      let payload = {
        componentID: 1,
        typeName: "CounterLCD"
      };

      let params = await MessageManagerService.getCommonParameters(payload);

      expect(params.length).to.equal(2);
    });

    it('should Return null', async () => {
      let payload = null;

      let params = await MessageManagerService.getCommonParameters(payload);

      expect(params).to.be.a('null');
    });
  });

  describe('broadcastMessage', () => {

    beforeEach(() => {
      sandbox.stub(EventsService, 'broadcastMessage').value({
        emit(type: string, topic: string, message: Message) {
          return true;
        }
      });
    });

    it('shoud return true', async () => {
      let message = new Message('testBroadcastMessage');

      let result = await MessageManagerService.broadcastMessage('testBroadcastMessage', 'MessageManagerService', message);
      expect(result).to.equal(true);
    });
  });

});
