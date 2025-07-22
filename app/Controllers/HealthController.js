import Controller from './Controller.js';
import Logger from '../Utils/Logger.js';

export default class HealthController extends Controller {
  constructor(response) {
    super(response);
  }

  checkHealth(request) {
    try {
      Logger.info("All Ok from health api");
      this.sendResponse({ "msg": "ALL OK!" });
    }
    catch (error) {
      this.handleException(error);
    }
  }
}