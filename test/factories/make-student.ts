import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Student, IStudent } from "@/domain/forum/enterprise/entities/student";

export class MakeStudentFactory {
  static execute(override: Partial<IStudent> = {}, id?: UniqueEntityId) {
    const student = Student.create(
      {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        ...override, // escreve qualquer coisa do override tenha enviado. As propriedades substituem as que já existem, se enviadas
      },
      id,
    );

    return student;
  }
}
