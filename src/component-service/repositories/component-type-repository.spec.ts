import { expect } from 'chai';
import * as sinon from 'ts-sinon';
import { DatabaseHelper } from './database-helper';
import { KeyValue } from '../shared/models/key-value';
import { Logger } from '../shared/services/logger.service';
import { ComponentTypeRepository } from './component-type-repository';
import { ComponentType } from '../shared/models/component-type';
import { DatabaseService } from '../shared/services/database.service';

describe('component type repository', () => {
  let sandbox = sinon.default.sandbox.create();
  let dbServiceStub;
  let getTableNameStub, getEntityAttributesStub, getParametersStub, prepareConditionStub;

  beforeEach(() => {
      sandbox.stub(Logger, 'error').callsFake(() => {
        return {}
      });

      getTableNameStub = sandbox.stub(DatabaseHelper, 'getTableName').callsFake(() => { sandbox.spy() });
      getEntityAttributesStub = sandbox.stub(DatabaseHelper, 'getEntityAttributes').callsFake(() => { sandbox.spy() });
      getParametersStub = sandbox.stub(DatabaseHelper, 'getParameters').callsFake(() => { sandbox.spy() });
      prepareConditionStub = sandbox.stub(DatabaseHelper, 'prepareCondition').callsFake(() => { return new KeyValue('sql', 'test') });

      dbServiceStub = sandbox.stub(DatabaseService.prototype);
      dbServiceStub.get.callsFake(() => { sandbox.spy() });
      dbServiceStub.open.callsFake(() => { sandbox.spy() });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getAll', () => {

    it('should call four methods', async () => {
      let componentTypeRepository = new ComponentTypeRepository();

      await componentTypeRepository.getAll(new ComponentType());

      expect(dbServiceStub.get.calledOnce).to.equal(true);
      expect(dbServiceStub.open.calledOnce).to.equal(true);
      expect(getTableNameStub.calledOnce).to.equal(true);
      expect(getEntityAttributesStub.calledOnce).to.equal(true);
    });

    it('should return null', async () => {
      let componentTypeRepository = new ComponentTypeRepository();

      let type = await componentTypeRepository.getAll(new ComponentType());

      expect(type).to.be.a('null');
    });

  });

  describe('get', () => {

    it('should call six methods', async () => {
      let componentTypeRepository = new ComponentTypeRepository();

      await componentTypeRepository.get(new ComponentType(), new Array<KeyValue>());

      expect(dbServiceStub.get.calledOnce).to.equal(true);
      expect(dbServiceStub.open.calledOnce).to.equal(true);
      expect(getTableNameStub.calledOnce).to.equal(true);
      expect(getEntityAttributesStub.calledOnce).to.equal(true);
      expect(getParametersStub.calledOnce).to.equal(true);
      expect(prepareConditionStub.calledOnce).to.equal(true);
    });

    it('should return null', async () => {
      let componentTypeRepository = new ComponentTypeRepository();

      let type = await componentTypeRepository.get(new ComponentType(), new Array<KeyValue>());

      expect(type).to.be.a('null');
    });

  });

});
