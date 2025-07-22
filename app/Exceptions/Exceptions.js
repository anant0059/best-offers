/**
 * exposes all custom exceptions
 */
import GeneralException from './GeneralException.js';
import NotFoundException from './NotFoundException.js';
import ConflictException from './ConflictException.js';
import ForbiddenException from './ForbiddenException.js';
import ValidationException from './ValidationException.js';
import UnauthorizedException from './UnauthorizedException.js';
import BadRequestException from './BadRequestException.js';
import PermissionDeniedException from './PermissionDeniedException.js';
import InternalServerErrorException from './InternalServerErrorException.js';

export {
  GeneralException,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  ValidationException,
  UnauthorizedException,
  BadRequestException,
  PermissionDeniedException,
  InternalServerErrorException
};
