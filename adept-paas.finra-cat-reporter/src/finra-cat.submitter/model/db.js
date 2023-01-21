const { MongoClient, ObjectID }         = require("mongodb");

class DB {

  constructor(uri, dbName) {

    this.uri = uri;
    this.dbName = dbName;

  }

  async connect() {

    this.client = new MongoClient(this.uri, { useUnifiedTopology: true });
    await this.client.connect();
    this.db = this.client.db(this.dbName);

  }

  collection(name) {

    return {

      create: async (doc) => {

        let result = await this.db.collection(name).insertOne(doc);

        return await this.db
          .collection(name)
          .findOne({ _id: result.insertedId });

      },
      find: async (query, { limit = 10, skip = 0, sort = {} } = {}) => {

        let count = await this.db.collection(name).countDocuments(query);
        let docs = [];
        if (limit > 0 && count > 0) {

          docs = await this.db
            .collection(name)
            .find(query)
            .limit(limit)
            .skip(skip)
            .sort(sort)
            .toArray();
        }
        return {

          count: count,
          limit: limit,
          skip: skip,
          data: docs,

        };

      },
      update: async (id, data) => {

        await this.db.collection(name).replaceOne({ _id: ObjectID(id) }, data);

        return this.db.collection(name).findOne({ _id: ObjectID(id) });

      },
      patch: async (id, data) => {

        await this.db
          .collection(name)
          .updateOne(
            { _id: ObjectID(id) },
            {
              $set: data,
            }
          );

        return await this.db.collection(name)
          .findOne({ _id: ObjectID(id) });
      },
      remove: async (id) => {

        let doc = await this.db.collection(name).findOne({ _id: ObjectID(id) });

        await this.db.collection(name).deleteOne({ _id: ObjectID(id) });

        return doc;

      },
      get: async (id) => {

        return await this.db.collection(name).findOne({ _id: ObjectID(id) });

      },
    };
  }
}


module.exports = DB;
