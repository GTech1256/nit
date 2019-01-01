import { connect, Document, DocumentQuery, model, Model, Schema, Types } from 'mongoose';
export let ObjectId = Schema.Types.ObjectId;
export let Mixed = Schema.Types.Mixed;

/**
 * see
 * https://hackernoon.com/generic-repository-with-typescript-and-node-js-731c10a1b98e
 * https://gitee.com/BearCAD/codes/9heak8n1jmpt72y05dg3l23
 */

export interface IRead<T extends Document> {
  retrieve: (callback: (error: any, result: any) => void) => void;
  findById: (id: string, callback: (error: any, result: T) => void) => void;
  findOne(cond?: object, callback?: (err: any, res: T) => void): DocumentQuery<Document | null, Document>;
  find(
    cond: object,
    fields: object,
    options: object,
    callback?: (err: any, res: T[]) => void
  ): DocumentQuery<Document[], Document>;
}

export interface IWrite<T> {
  create: (item: T, callback: (error: any, result: any) => void) => void;
  update: (id: Types.ObjectId, item: T, callback: (error: any, result: any) => void) => void;
  delete: (id: string, callback: (error: any, result: any) => void) => void;
}

export class RepositoryBase<T extends Document> implements IRead<T>, IWrite<T> {
  private model: Model<Document>;

  constructor(schemaModel: Model<Document>) {
    this.model = schemaModel;
  }

  public create(item: T, callback: (error: any, result: T) => void) {
    this.model.create(item, callback);
  }

  public retrieve(callback: (error: any, result: T) => void) {
    this.model.find({}, callback);
  }

  public update(id: Types.ObjectId, item: T, callback: (error: any, result: any) => void) {
    this.model.update({ _id: id }, item, callback);
  }

  public delete(id: string, callback: (error: any, result: any) => void) {
    this.model.remove({ _id: this.toObjectId(id) }, function(err) { callback(err, null); });
  }

  public findById(id: string, callback: (error: any, result: T) => void) {
    this.model.findById(id, callback);
  }

  public findOne(cond?: object, callback?: (err: any, res: T) => void) {
    return this.model.findOne(cond, callback);
  }

  public find(cond?: object, fields?: object, options?: object, callback?: (err: any, res: T[]) => void) {
    return this.model.find(cond, options, callback);
  }

  private toObjectId(id: string): Types.ObjectId {
    return Types.ObjectId.createFromHexString(id);
  }
}
