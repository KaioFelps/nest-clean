import { MakeAnswerFactory } from "test/factories/make-answer";
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";
import {
  SendNotificationService,
  ISendNotificationResponse,
  ISendNotificationService,
} from "../services/send-notification";
import { InMemoryNotificationRepository } from "test/repositories/in-memory-notification-repository";
import { SpyInstance } from "vitest";
import { waitFor } from "test/util/wait-for";
import { MakeAnswerCommentFactory } from "test/factories/make-answer-comment";
import { InMemoryAnswerCommentRepository } from "test/repositories/in-memory-answer-comment-repository";
import { OnAnswerCommentCreated } from "./on-answer-comment-created";

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository;
let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sendNotificationService: SendNotificationService;

// os generics recebem 2 parâmetros: um array com os parâmetros da função e, em seguida, o tipo da resposta da função
let sendNotificationExecuteSpy: SpyInstance<
  [ISendNotificationService],
  Promise<ISendNotificationResponse>
>;

describe("On answer comment created", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    );

    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository();

    inMemoryNotificationRepository = new InMemoryNotificationRepository();

    sendNotificationService = new SendNotificationService(
      inMemoryNotificationRepository,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationService, "execute");

    new OnAnswerCommentCreated(
      inMemoryAnswerRepository,
      sendNotificationService,
    );
  });

  test("if it sends a notification when an answer comment is created", () => {
    const answer = MakeAnswerFactory.execute();
    const comment = MakeAnswerCommentFactory.execute({ answerId: answer.id });

    inMemoryAnswerRepository.create(answer);
    inMemoryAnswerCommentRepository.create(comment);

    waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
