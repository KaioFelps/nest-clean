import { Either, left, right } from "@/core/either";
import { Question } from "../../enterprise/entities/question";
import { IQuestionRepository } from "../repositories/question-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";

interface IGetQuestionBySlugService {
  slug: string;
}

type IGetQuestionBySlugResponse = Either<
  ResourceNotFoundError,
  { question: Question }
>;

@Injectable()
export class GetQuestionBySlugService {
  constructor(private questionRepository: IQuestionRepository) {}

  async execute({
    slug,
  }: IGetQuestionBySlugService): Promise<IGetQuestionBySlugResponse> {
    const question = await this.questionRepository.findBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    return right({ question });
  }
}
