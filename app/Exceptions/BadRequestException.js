/**
 * general request exception module
 */
import Exception from './Exception.js';

export default class BadRequestException extends Exception {
  constructor(message) {
    super();
    this.constructor = BadRequestException;
    this.name = this.constructor.name;
    this.message = (message) || 'Request contains insufficient data.';
  }
}
