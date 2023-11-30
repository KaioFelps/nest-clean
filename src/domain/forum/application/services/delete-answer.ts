import { Either, left, right } from "@/core/either";
import { IAnswerRepository } from "../repositories/answer-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";
import { Injectable } from "@nestjs/common";

interface IDeleteAnswerService {
  authorId: string;
  answerId: string;
}

type IDeleteAnswerResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class DeleteAnswerService {
  constructor(private answerRepository: IAnswerRepository) {}

  async execute({
    authorId,
    answerId,
  }: IDeleteAnswerService): Promise<IDeleteAnswerResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.answerRepository.delete(answer);

    return right(null);
  }
}
