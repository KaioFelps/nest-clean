import { ServiceError } from "@/core/errors/service-error";

export class InvalidAttachmentType extends Error implements ServiceError {
  constructor(type: string) {
    super(`File type ${type} is not supported.`);
  }
}
