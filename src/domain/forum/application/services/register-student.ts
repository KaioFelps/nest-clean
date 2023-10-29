import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Student } from "../../enterprise/entities/student";
import { IStudentRepository } from "../repositories/student-repository";
import { IHasheGenerator } from "../cryptography/hash-generator";
import { StudentAlreadyExistsError } from "./errors/student-already-exists-error";

interface IRegisterStudentService {
  name: string;
  email: string;
  password: string;
}

type IRegisterStudentResponse = Either<
  StudentAlreadyExistsError,
  { student: Student }
>;

@Injectable()
export class RegisterStudentService {
  constructor(
    private studentRepository: IStudentRepository,
    private hashGenerator: IHasheGenerator,
  ) {}

  async execute({
    email,
    name,
    password,
  }: IRegisterStudentService): Promise<IRegisterStudentResponse> {
    const userWithSameEmail = await this.studentRepository.findByEmail(email);

    if (userWithSameEmail) {
      return left(new StudentAlreadyExistsError(email));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const student = Student.create({ name, email, password: hashedPassword });

    await this.studentRepository.create(student);

    return right({ student });
  }
}
