import * as mongoose from 'mongoose';
import { RepositoryBase } from './base/RepositoryBase';
import { contractModel, IContractModel } from './contract';

export class ContractRepository extends RepositoryBase<IContractModel> {
  constructor() {
    super(contractModel);
  }
}

Object.seal(ContractRepository);
