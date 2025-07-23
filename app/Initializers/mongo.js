/**
 * module for creating mongodb connection
 */

import mongoose from 'mongoose';
import Logger from '../Utils/Logger.js';

export default class Mongo {
   /**
    * creates connection with mongodb
    */
   constructor() {
     const proto = Object.getPrototypeOf(this);
     console.log('MongoDB Initializer');
     if (!proto.connection) {
       proto.connection = mongoose.connect(process.bestoffer.db.url ,{ useNewUrlParser: true, useUnifiedTopology: true, serverApi: { version: '1' } });
     }
   }
 }
 
