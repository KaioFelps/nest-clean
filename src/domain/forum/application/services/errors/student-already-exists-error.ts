import { ServiceError } from "@/core/errors/service-error";

export class StudentAlreadyExistsError extends Error implements ServiceError {
  constructor(email: string) {
    super(`Student with same e-mail "${email}" already exists.`);
  }
}
