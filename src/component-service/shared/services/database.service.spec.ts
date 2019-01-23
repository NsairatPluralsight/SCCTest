import { expect } from 'chai';
import * as sinon from 'ts-sinon';
import { DatabaseService } from './database.service';
import { DBParameters, DBResult } from '../models/database-configuration';
import { Logger } from './logger.service';
import { Constants } from '../models/constants';
import { Result } from '../models/enum';
import { IRecordSet } from 'mssql';
var mssql = require('mssql');

describe('Database Service', () => {
  let sandbox = sinon.default.sandbox.create();
  let queryStub, executeStub, inputStub;

  beforeEach(() => {
    sandbox.stub(Logger, 'error').callsFake(() => {
      return {}
    });

    inputStub = sandbox.stub(mssql.Request.prototype, 'input').callsFake(() => { sandbox.spy() });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('get', () => {

    it('should call query once', async () => {
      let database = new DatabaseService();
      queryStub = sandbox.stub(mssql.Request.prototype, 'query').callsFake(() => { sandbox.spy() });

      await database.get('', new Array<DBParameters>());

      expect(queryStub.calledOnce).to.equal(true);
    });

    it('should return object', async () => {
      let database = new DatabaseService();

      let dbresult = new DBResult();
      dbresult.recordset = <IRecordSet<object>>{columns: {}};

      executeStub = sandbox.stub(mssql.Request.prototype, 'query');
      executeStub.resolves(dbresult);
      let result = await database.get('', new Array<DBParameters>());

      expect(result).to.equal(dbresult.recordset);
    });
  });

  describe('executeProcedure', () => {

    it('should call execute once', async () => {
      let database = new DatabaseService();
      executeStub = sandbox.stub(mssql.Request.prototype, 'execute').callsFake(() => { sandbox.spy() });

      await database.executeProcedure('', new Array<DBParameters>());

      expect(executeStub.calledOnce).to.equal(true);
    });

    it('should call return Success', async () => {
      let database = new DatabaseService();

      let dbresult = new DBResult();
      dbresult.rowsAffected = new Array<number>();
      dbresult.rowsAffected.push(1);

      executeStub = sandbox.stub(mssql.Request.prototype, 'execute');
      executeStub.resolves(dbresult);
      let result = await database.executeProcedure('', new Array<DBParameters>());

      expect(result).to.equal(Result.Success);
    });

    it('should call return Failed', async () => {
      let database = new DatabaseService();

      let dbresult = new DBResult();
      dbresult.rowsAffected = new Array<number>();

      executeStub = sandbox.stub(mssql.Request.prototype, 'execute');
      executeStub.resolves(dbresult);
      let result = await database.executeProcedure('', new Array<DBParameters>());

      expect(result).to.equal(Result.Failed);
    });
  });

  describe('addParameters', () => {

    it('should call input twice', async () => {
      let dbParams = new Array<DBParameters>();
      dbParams.push(new DBParameters(Constants.cID, '1', mssql.BigInt));
      dbParams.push(new DBParameters(Constants.cTYPE_NAME, 'CounterLCd', mssql.NVarChar));

      let database = new DatabaseService();
      await database.addParameters(dbParams);

      expect(inputStub.calledTwice).to.equal(true);
    });

    it('should not call input', async () => {
      let database = new DatabaseService();

      await database.addParameters(new Array<DBParameters>());

      expect(inputStub.calledOnce).to.equal(false);
    });

  });

});
