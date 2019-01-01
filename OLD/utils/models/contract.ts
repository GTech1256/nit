import * as mongoose from 'mongoose';
import { ContractRepository } from './ContractRepository';
import { getNumberEnumValues } from '../helper';
import { default as log } from '../logger/logger';

export interface IContractBody {
  program: string;
  inputs: string;
}

export interface ITarget {
  value: string;
  type: TargetType;
}
export interface IContractIdentifier {
  guid: string;
  title: string;
  namespace: string;
}

export enum ContractState {
  Unset = 0,
  Bad = 1,
  Good = 2,
}

export enum TargetType {
  Unset = 0,
  Bad = 1,
  Good = 2,
}

// TODO: use Typegoose
export interface IContractModel extends mongoose.Document {
  guid: string; // TODO IContractIdentifier
  title: string; // TODO IContractIdentifier
  namespace: string; // TODO IContractIdentifier
  body: {
    program: string; // TODO use IContractBody
    inputs: string; // TODO use IContractBody
  };
  target: {
    value: string; // TODO use ITarget
    type: TargetType; // TODO use ITarget
  };
  sender: string;
  status: ContractState; // TODO: enum
  createdAt?: Date;
  modifiedAt?: Date;
}

const contractSchema = new mongoose.Schema(
  {
    guid: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      index: false,
      required: false,
    },
    namespace: {
      type: String,
      index: false,
      required: false,
    },
    body: {
      program: {
        type: String,
        index: false,
        required: false,
      },
      inputs: {
        type: String,
        index: false,
        required: false,
      },
    },
    sender: {
      type: String,
      index: false,
      required: false,
    },
    target: {
      value: {
        type: String,
        index: false,
        required: true,
      },
      type: {
        type: Number,
        enum: getNumberEnumValues(TargetType),
        default: ContractState.Unset,
        required: true,
      },
    },
    owner: {
      // address or 'none'
      type: String,
      required: false,
    },
    status: {
      type: Number,
      enum: getNumberEnumValues(ContractState),
      default: ContractState.Unset,
      required: false,
    },
    createdAt: {
      type: Date,
      required: false,
    },
    modifiedAt: {
      type: Date,
      required: false,
    },
  },
  {
    minimize: false, // allows to keep empty objects as a field values (otherwise the field won't be used)
    strict: false, // allows to store fields that are not described in the schema
  }
);

// NOTE: timezone MUST be same between all our servers
contractSchema.pre('save', function(next) {
  const doc = this as IContractModel;
  const now = new Date();
  if (!doc.createdAt) {
    doc.createdAt = now;
  }
  doc.modifiedAt = now;
  next();
});

export let contractModel = mongoose.model<IContractModel>('Contract', contractSchema);

export class ContractModel {
  public static createContract(
    contractIdentifier: IContractIdentifier,
    body: IContractBody,
    target: ITarget,
    sender: string,
    status: ContractState
  ): Promise<IContractModel> {
    const p = new Promise<IContractModel>((resolve, reject) => {
      const repo = new ContractRepository();
      const contract = {
        sender,
        status,
        guid: contractIdentifier.guid,
        namespace: contractIdentifier.namespace,
        title: contractIdentifier.title,
        body: {
          program: body.program,
          inputs: body.inputs,
        }, // TODO: use interface
        target: {
          type: target.type,
          value: target.value,
        }, // TODO: use interface
      } as IContractModel;
      // console.log('randomString1', contract.guid);

      repo.create(contract, function(err: any, res: IContractModel) {
        if (err) {
          log.error('repo.create err %o', err);
          reject(err);
        } else {
          log.error('repo.create ok %o', res);
          resolve(res);
        }
      });
    });

    return p;
  }

  public static findContract(guid: string, status: ContractState): Promise<IContractModel> {
    const p = new Promise<IContractModel>(function(resolve, reject) {
      const repo = new ContractRepository();

      repo.findOne({ guid, status }, function(err: any, res: any) {
        log.info(`findContract by ${guid}: %o %o`, err, res);
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });

    return p;
  }

  private contractModel: IContractModel;

  constructor(model: IContractModel) {
    this.contractModel = model;
  }

  get id(): string {
    return this.contractModel.id;
  }

  get sender(): string {
    return this.contractModel.sender;
  }

  get body(): IContractBody {
    return {
      program: this.contractModel.body.program,
      inputs: this.contractModel.body.inputs,
    } as IContractBody;
  }

  get target(): ITarget {
    return {
      type: this.contractModel.target.type,
      value: this.contractModel.target.value,
    } as ITarget;
  }

  get identifier(): IContractIdentifier {
    return {
      guid: this.contractModel.guid,
      title: this.contractModel.title,
      namespace: this.contractModel.namespace,
    } as IContractIdentifier;
  }

  get status(): ContractState {
    return this.contractModel.status;
  }
}

Object.seal(ContractModel);

/*
// TODO: need it?
contractSchema.index({
  'id': 'text'
});*/

export default contractModel;
