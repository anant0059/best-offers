import Joi from "@hapi/joi";
import Logger from "../Utils/Logger.js";

export default class Contoller {
  constructor(response) {
    this.response = response;
  }

  async validateParams(request, validationSchema, queryParams = false) {
    if (validationSchema) {
      let temp = request.body;
      if (queryParams) {
        temp = request.query;
      }
      
      const { error, value } = validationSchema.validate(temp, {
        abortEarly: false,
        allowUnknown: false,
      });
      
      if (error) {
        error.name = "ValidationException";
        throw error;
      }
      return value;
    }

    return null;
  }

  sendResponse(data) {
    this.response.status(200).json({ data });
  }

  handleException(error) {
    if (error.sql) {
      error.name = "DbException";
    }

    switch (error.name) {
      case "InternalServerErrorException":
        this.response.status(500).json({ error: error.message });
        Logger.error(new Error(error));
        break;
      case "GeneralException":
        this.response.status(501).json({ error: error.message });
        Logger.error(new Error(error));
        break;
      case "UnauthorizedException":
        Logger.error("UnauthorizedException: %s", error.message);
        this.response.status(401).json({ error: error.message });
        break;
      case "NotFoundException":
        Logger.error("NotFoundException: %s", error.message);
        this.response.status(404).json({ error: error.message });
        break;
      case "ConflictException":
        Logger.error("ConflictException: %s", error.message);
        this.response.status(409).json({ error: error.message });
        break;
      case "ValidationException":
        Logger.error("ValidationException: %s", error.message);
        this.response.status(422).json({ error: error.message });
        break;
      case "ForbiddenException":
        Logger.error("ForbiddenException: %s", error.message);
        this.response.status(403).json({ error: error.message });
        break;
      case "BadRequestException":
        Logger.error("BadRequestException: %s", error.message);
        this.response.status(400).json({ error: error.message });
        break;
      case "PermissionDeniedException":
        Logger.error("PermissionDeniedException: %s", error.message);
        this.response.status(403).json({ error: error.message });
        break;
      default:
        Logger.error(new Error(error));
        this.response
          .status(501)
          .json({ error: "unable to process request!, please try later" });
        break;
    }
  }
}
