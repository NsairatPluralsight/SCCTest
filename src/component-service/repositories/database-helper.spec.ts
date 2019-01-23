import { expect } from 'chai';
import * as sinon from 'ts-sinon';
import { DatabaseHelper } from './database-helper';
import { Component } from '../shared/models/component';
import { KeyValue } from '../shared/models/key-value';
import { Constants } from '../shared/models/constants';
import { Logger } from '../shared/services/logger.service';
import * as mssql from 'mssql';

describe('database helper', () => {

  let sandbox = sinon.default.sandbox.create();
  beforeEach(() => {
    sandbox.stub(Logger, 'error').callsFake(() => {
        return {}
      });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getEntityAttributes', () => {

    it('should return 17 attributes', async () => {
      let attributes = await DatabaseHelper.getEntityAttributes(new Component);

      let attributesArray = attributes.split(',')

      expect(attributesArray.length).to.equal(17);
    });

  });

  describe('prepareCondition', () => {

    it('Condition should not be null', async () => {
      let params = new Array<KeyValue>();
      params.push(new KeyValue(Constants.cID, '1'));
      params.push(new KeyValue(Constants.cTYPE_NAME, 'CounterLCD'));

      let condition = await DatabaseHelper.prepareCondition(params);

      expect(condition.value).to.not.be.a('null');
    });

    it('Condition should be null', async () => {
      let params: Array<KeyValue>;

      let condition = await DatabaseHelper.prepareCondition(params);

      expect(condition).to.be.a('null');
    });

  });

  describe('getParameters', () => {

    it('should return 2 paramters', async () => {
      let params = new Array<KeyValue>();
      params.push(new KeyValue(Constants.cID, '1'));
      params.push(new KeyValue(Constants.cTYPE_NAME, 'CounterLCD'));

      let dbparams = await DatabaseHelper.getParameters(params);

      expect(dbparams.length).to.equal(2);
    });

    it('should return null', async () => {
      let params: Array<KeyValue>;

      let dbparams = await DatabaseHelper.getParameters(params);

      expect(dbparams).to.be.a('null');
    });

  });

  describe('getDBType', () => {

    it('type should be NVarChar', async () => {
      let type = await DatabaseHelper.getDBType(Constants.cTYPE_NAME);

      expect(type).to.equal(mssql.NVarChar);
    });

    it('type should be BigInt', async () => {
      let type = await DatabaseHelper.getDBType(Constants.cID);

      expect(type).to.equal(mssql.BigInt);
    });

  });

  describe('getTableName', () => {

    it('should return table name', async () => {
      let tableName = await DatabaseHelper.getTableName(new Component());

      expect(tableName).to.equal('cst_Component');
    });
  });

});
