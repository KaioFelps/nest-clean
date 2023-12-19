import { InMemoryAttachmentRepository } from "test/repositories/in-memory-attachment-repository";
import { UploadAndCreateAttachmentService } from "./upload-and-create-attachment";
import { FakeUploader } from "test/storage/fake-uploader";
import { InvalidAttachmentType } from "./errors/invalid-attachment-type";

let inMemoryAttachmentRepository: InMemoryAttachmentRepository;
let fakeUploader: FakeUploader;
let sut: UploadAndCreateAttachmentService;

describe("Upload and create attachment service", () => {
  beforeEach(() => {
    inMemoryAttachmentRepository = new InMemoryAttachmentRepository();
    fakeUploader = new FakeUploader();
    sut = new UploadAndCreateAttachmentService(
      inMemoryAttachmentRepository,
      fakeUploader,
    );
  });

  test("if it's possible to create and upload a new attachment", async () => {
    const result = await sut.execute({
      fileName: "profile.png",
      fileType: "image/png",
      body: Buffer.from(""),
    });

    expect(result.isRight()).toBe(true);

    expect(result.value).toEqual({
      attachment: inMemoryAttachmentRepository.items[0],
    });

    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: "profile.png",
      }),
    );
  });

  test("if it's not able to upload an attachment with invalid file type", async () => {
    const result = await sut.execute({
      fileName: "presentation.mp3",
      fileType: "audio/mpeg",
      body: Buffer.from(""),
    });

    expect(result.isLeft()).toBe(true);

    expect(result.value).toBeInstanceOf(InvalidAttachmentType);
  });
});
