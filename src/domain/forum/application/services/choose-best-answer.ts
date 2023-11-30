import { Question } from "../../enterprise/entities/question";
import { IQuestionRepository } from "../repositories/question-repository";
import { IAnswerRepository } from "../repositories/answer-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";
import { Injectable } from "@nestjs/common";

interface IChooseBestAnswerService {
  answerId: string;
  authorId: string;
}

type IChooseBestAnswerResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { question: Question }
>;

@Injectable()
export class ChooseBestAnswerService {
  constructor(
    private answerRepository: IAnswerRepository,
    private questionRepository: IQuestionRepository,
  ) {}

  async execute({
    answerId,
    authorId,
  }: IChooseBestAnswerService): Promise<IChooseBestAnswerResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    const question = await this.questionRepository.findById(
      answer.questionId.toString(),
    );

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    question.bestAnswerId = answer.id;

    await this.questionRepository.save(question);

    return right({ question });
  }
}
