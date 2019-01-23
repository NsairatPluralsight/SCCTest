import { expect } from 'chai';
import * as sinon from 'ts-sinon';
import { Logger } from './logger.service';

describe('Logger service', () => {

  describe('error', () => {
    let sandbox = sinon.default.sandbox.create();

    afterEach(() => {
      sandbox.restore();
    });

    it('should be called once', () => {
      let spy = sandbox.spy(Logger, 'error');

     Logger.error(new Error('test'));

     expect(spy.calledOnce).to.equal(true);
    });
  });

});
