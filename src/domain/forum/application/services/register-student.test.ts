import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";
import { RegisterStudentService } from "./register-student";
import { IHashGenerator } from "../cryptography/hash-generator";
import { FakeHasher } from "test/cryptography/fake-hasher";

let inMemoryStudentRepository: InMemoryStudentRepository;
let fakeHasher: IHashGenerator;
let sut: RegisterStudentService;

describe("Register student service", () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterStudentService(inMemoryStudentRepository, fakeHasher);
  });

  test("if it's possible to register a new student", async () => {
    const result = await sut.execute({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "teste123",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      student: inMemoryStudentRepository.items[0],
    });
  });

  test("if it has hashed the new student password on registration", async () => {
    const result = await sut.execute({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "teste123",
    });

    const hashedPassowrd = await fakeHasher.hash("teste123");

    expect(result.isRight()).toBe(true);
    expect(inMemoryStudentRepository.items[0].password).toEqual(hashedPassowrd);
  });
});
