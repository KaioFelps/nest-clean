import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";
import { AuthenticateStudentService } from "./authenticate-student";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { MakeStudentFactory } from "test/factories/make-student";

let inMemoryStudentRepository: InMemoryStudentRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateStudentService;

describe("Authenticate student service", () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateStudentService(
      inMemoryStudentRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  test("if it's possible to authenticate a new student", async () => {
    const student = MakeStudentFactory.execute({
      email: "johndoe@example.com",
      password: await fakeHasher.hash("teste123"),
    });

    inMemoryStudentRepository.items.push(student);

    const result = await sut.execute({
      email: "johndoe@example.com",
      password: "teste123",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
