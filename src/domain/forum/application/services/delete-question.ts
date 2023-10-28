import { Either, left, right } from "@/core/either";
import { IQuestionRepository } from "../repositories/question-repository-interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";

interface IDeleteQuestionService {
  authorId: string;
  questionId: string;
}

type IDeleteQuestionResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

export class DeleteQuestionService {
  constructor(private questionRepository: IQuestionRepository) {}

  async execute({
    authorId,
    questionId,
  }: IDeleteQuestionService): Promise<IDeleteQuestionResponse> {
    const question = await this.questionRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.questionRepository.delete(question);

    return right(null);
  }
}
