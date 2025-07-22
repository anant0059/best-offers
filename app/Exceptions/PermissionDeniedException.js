/**
 * general request exception module
 */
import Exception from './Exception.js';

export default class PermissionDeniedException extends Exception {
  constructor(message) {
    super();
    this.constructor = PermissionDeniedException;
    this.name = this.constructor.name;
    this.message = (message) || 'Permission Denied for the user';
  }
}
