import { Either, left, right } from "@/core/either";
import { IQuestionRepository } from "../repositories/question-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { QuestionWithDetails } from "../../enterprise/entities/value-objects/question-with-details";

interface IGetQuestionBySlugService {
  slug: string;
}

type IGetQuestionBySlugResponse = Either<
  ResourceNotFoundError,
  { question: QuestionWithDetails }
>;

@Injectable()
export class GetQuestionBySlugService {
  constructor(private questionRepository: IQuestionRepository) {}

  async execute({
    slug,
  }: IGetQuestionBySlugService): Promise<IGetQuestionBySlugResponse> {
    const question = await this.questionRepository.findBySlugWithDetails(slug);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    return right({ question });
  }
}
