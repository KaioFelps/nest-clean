import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { IStudentRepository } from "../repositories/student-repository";
import { IHashComparer } from "../cryptography/hash-comparor";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";
import { IEncrypter } from "../cryptography/encrypter";

interface IAuthenticateStudentService {
  email: string;
  password: string;
}

type IAuthenticateStudentResponse = Either<
  WrongCredentialsError,
  { accessToken: string }
>;

@Injectable()
export class AuthenticateStudentService {
  constructor(
    private studentRepository: IStudentRepository,
    private hashComparor: IHashComparer,
    private encrypter: IEncrypter,
  ) {}

  async execute({
    email,
    password,
  }: IAuthenticateStudentService): Promise<IAuthenticateStudentResponse> {
    const student = await this.studentRepository.findByEmail(email);

    if (!student) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashComparor.compare(
      password,
      student.password,
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    });

    return right({ accessToken });
  }
}
