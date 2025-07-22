/**
 * general request exception module
 */
import Exception from './Exception.js';

export default class InternalServerErrorException extends Exception {
  constructor(message) {
    super();
    this.constructor = InternalServerErrorException;
    this.name = this.constructor.name;
    this.message = (message) || 'Please contact tech team.';
  }
}