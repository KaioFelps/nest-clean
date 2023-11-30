import { GetQuestionBySlugService } from "@/domain/forum/application/services/get-question-by-slug";
import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from "@nestjs/common";
import { QuestionPresenter } from "../presenters/question-presenter";
import { ResourceNotFoundError } from "@/domain/forum/application/services/errors/resource-not-found-error";

@Controller("/questions/:slug")
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlug: GetQuestionBySlugService) {}

  @Get()
  async handle(@Param("slug") slug: string) {
    const result = await this.getQuestionBySlug.execute({ slug });

    if (result.isLeft()) {
      if (result.value instanceof ResourceNotFoundError) {
        throw new HttpException(
          new ResourceNotFoundError().message,
          HttpStatus.NOT_FOUND,
        );
      }

      throw new BadRequestException();
    }

    return {
      question: QuestionPresenter.toHTTP(result.value.question),
    };
  }
}
