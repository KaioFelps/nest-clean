import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { IAnswerRepository } from "../repositories/answer-repository-interface";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { IAnswerCommentRepository } from "../repositories/answer-comment-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface ICommentOnAnswerService {
  authorId: string;
  answerId: string;
  content: string;
}

type ICommentOnAnswerResponse = Either<
  ResourceNotFoundError,
  { answerComment: AnswerComment }
>;

export class CommentOnAnswerService {
  constructor(
    private answerRepository: IAnswerRepository,
    private answerCommentRepository: IAnswerCommentRepository,
  ) {}

  async execute({
    authorId,
    content,
    answerId,
  }: ICommentOnAnswerService): Promise<ICommentOnAnswerResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityId(authorId),
      answerId: new UniqueEntityId(answerId),
      content,
    });

    await this.answerCommentRepository.create(answerComment);

    return right({ answerComment });
  }
}
