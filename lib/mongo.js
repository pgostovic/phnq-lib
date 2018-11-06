import mongodb from 'mongodb';
import Model, { string } from './model';

const { MongoClient, ObjectId } = mongodb;

export class Mongo {
  constructor(url) {
    this.url = url;
  }

  async connect() {
    this.client = await MongoClient.connect(
      this.url,
      { useNewUrlParser: true }
    );
    this.db = this.client.db();
  }

  async close() {
    return this.client.close();
  }

  async collectionExists(name) {
    return !!(await this.db.collections()).find(c => c.collectionName === name);
  }

  async createCollection(name) {
    return this.db.createCollection(name);
  }

  collection(name) {
    return this.db.collection(name);
  }

  async addModel(m) {
    const ModelClass = m;
    const { collection, name } = ModelClass;

    ModelClass.schema.id = string;

    const collName = collection || name;
    if (await this.collectionExists(collName)) {
      ModelClass._collection = this.collection(collName);
    } else {
      ModelClass._collection = await this.createCollection(collName);
    }

    ModelClass.one = async q => {
      const query = { ...q };

      if (query.id) {
        query._id = new ObjectId(query.id);
        delete query.id;
      }
      const obj = await ModelClass._collection.findOne(query);
      if (obj) {
        return new ModelClass(obj);
      }
      return null;
    };

    ModelClass.find = async q => {
      const results = [];
      await ModelClass._collection.find(q).forEach(doc => {
        results.push(new ModelClass(doc));
      });
      return results;
    };

    ModelClass.reset = async () => {
      await ModelClass._collection.drop();
      ModelClass._collection = await this.createCollection(collName);
    };

    ModelClass.deleteAll = async () => ModelClass._collection.deleteMany({});

    ModelClass.createIndex = async (...args) => ModelClass._collection.createIndex(...args);
  }
}

export const saveMany = async many => {
  const byCol = new Map();

  many.forEach(one => {
    const items = byCol.get(one.collection) || [];
    byCol.set(one.collection, [...items, one]);
  });

  byCol.forEach(async (items, col) => {
    // Updates just call save sequentially...
    items.filter(item => !!item.id).forEach(async item => item.save());

    await col.insertMany(
      items.filter(item => !item.id).map(item => {
        const props = { ...item };
        delete props.id;
        return props;
      })
    );
  });
};

export class MongoModel extends Model {
  constructor(props) {
    const id = props.id || props._id;
    super({ ...props, id: id ? String(id) : undefined }, true);

    if (props._id) {
      Object.defineProperty(this, 'ts', { value: props._id.getTimestamp(), writable: false, enumerable: true });
    }
  }

  get collection() {
    return this.constructor._collection;
  }

  async save() {
    if (this.id) {
      await this.collection.updateOne({ _id: new ObjectId(this.id) }, { $set: this.updates() });
    } else {
      const props = { ...this };
      delete props.id;
      this.id = String((await this.collection.insertOne(props)).insertedId);
    }
  }
}
