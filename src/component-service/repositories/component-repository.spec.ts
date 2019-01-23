import { expect } from 'chai';
import * as sinon from 'ts-sinon';
import { DatabaseHelper } from './database-helper';
import { KeyValue } from '../shared/models/key-value';
import { Logger } from '../shared/services/logger.service';
import { DatabaseService } from '../shared/services/database.service';
import { Component } from '../shared/models/component';
import { ComponentRepository } from './component-repository';
import { Constants } from '../shared/models/constants';

describe('component repository', () => {
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
      dbServiceStub.executeProcedure.callsFake(() => { sandbox.spy() });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getAll', () => {

    it('should call four methods', async () => {
      let componentRepository = new ComponentRepository();

      await componentRepository.getAll(new Component());

      expect(dbServiceStub.get.calledOnce).to.equal(true);
      expect(dbServiceStub.open.calledOnce).to.equal(true);
      expect(getTableNameStub.calledOnce).to.equal(true);
      expect(getEntityAttributesStub.calledOnce).to.equal(true);
    });

    it('should return null', async () => {
      let componentRepository = new ComponentRepository();

      let component = await componentRepository.getAll(new Component());

      expect(component).to.be.a('null');
    });

  });

  describe('get', () => {

    it('should call six methods', async () => {
      let componentRepository = new ComponentRepository();

      await componentRepository.get(new Component(), new Array<KeyValue>());

      expect(dbServiceStub.get.calledOnce).to.equal(true);
      expect(dbServiceStub.open.calledOnce).to.equal(true);
      expect(getTableNameStub.calledOnce).to.equal(true);
      expect(getEntityAttributesStub.calledOnce).to.equal(true);
      expect(getParametersStub.calledOnce).to.equal(true);
      expect(prepareConditionStub.calledOnce).to.equal(true);
    });

    it('should return null', async () => {
      let componentRepository = new ComponentRepository();

      let type = await componentRepository.get(new Component(), new Array<KeyValue>());

      expect(type).to.be.a('null');
    });

  });

  describe('getColumn', () => {

    it('should call five methods', async () => {
      let componentRepository = new ComponentRepository();

      await componentRepository.getColumn(new Component(), new Array<KeyValue>(), 'test');

      expect(dbServiceStub.get.calledOnce).to.equal(true);
      expect(dbServiceStub.open.calledOnce).to.equal(true);
      expect(getTableNameStub.calledOnce).to.equal(true);
      expect(getParametersStub.calledOnce).to.equal(true);
      expect(prepareConditionStub.calledOnce).to.equal(true);
    });

    it('should return null', async () => {
      let componentRepository = new ComponentRepository();

      let type = await componentRepository.getColumn(new Component(), new Array<KeyValue>(), 'test');

      expect(type).to.be.a('null');
    });

  });

  describe('update', () => {

    it('should call three methods', async () => {
      let componentRepository = new ComponentRepository();

      await componentRepository.update(new Array<KeyValue>());

      expect(dbServiceStub.open.calledOnce).to.equal(true);
      expect(dbServiceStub.executeProcedure.calledOnce).to.equal(true);
      expect(getParametersStub.calledOnce).to.equal(true);
    });

    it('should return failed', async () => {
      let componentRepository = new ComponentRepository();

      let result = await componentRepository.update(new Array<KeyValue>());

      expect(result).to.equal(-1);
    });

  });

  describe('updateConfig', () => {

    it('should call three methods', async () => {
      let componentRepository = new ComponentRepository();

      await componentRepository.updateConfig(new Array<KeyValue>());

      expect(dbServiceStub.open.calledOnce).to.equal(true);
      expect(dbServiceStub.executeProcedure.calledOnce).to.equal(true);
      expect(getParametersStub.calledOnce).to.equal(true);
    });

    it('should return failed', async () => {
      let componentRepository = new ComponentRepository();

      let result = await componentRepository.updateConfig(new Array<KeyValue>());

      expect(result).to.equal(-1);
    });

  });

  describe('updateReport', () => {

    it('should call three methods', async () => {
      let componentRepository = new ComponentRepository();

      await componentRepository.updateReport(new Array<KeyValue>());

      expect(dbServiceStub.open.calledOnce).to.equal(true);
      expect(dbServiceStub.executeProcedure.calledOnce).to.equal(true);
      expect(getParametersStub.calledOnce).to.equal(true);
    });

    it('should return failed', async () => {
      let componentRepository = new ComponentRepository();

      let result = await componentRepository.updateReport(new Array<KeyValue>());

      expect(result).to.equal(-1);
    });

  });

  describe('delete', () => {

    it('should call two methods', async () => {
      let params = new Array<KeyValue>();
      params.push(new KeyValue(Constants.cIDs, '1'));

      let componentRepository = new ComponentRepository();

      await componentRepository.delete(params);

      expect(dbServiceStub.open.calledOnce).to.equal(true);
      expect(dbServiceStub.executeProcedure.calledOnce).to.equal(true);
    });

    it('should return failed', async () => {
      let params = new Array<KeyValue>();
      params.push(new KeyValue(Constants.cIDs, '1'));

      let componentRepository = new ComponentRepository();

      let result = await componentRepository.delete(new Array<KeyValue>());

      expect(result).to.equal(-1);
    });

  });
});
