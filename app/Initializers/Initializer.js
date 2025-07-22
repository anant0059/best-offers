import Mongo from "./mongo.js";

export default class Initializer {
  static intializeServices() {
    const promiseStack = [];

    const mongoPromise = new Promise((resolve, reject) => {
      try {
        const mongo = new Mongo();
        resolve(mongo.connection);
        resolve(true);
      } catch (error) {
        reject(
          new Error(
            "Unable to create connection with mongo, please make sure mongo server is running."
          )
        );
      }
    });
    promiseStack.push(mongoPromise);

    return promiseStack;
  }
}
