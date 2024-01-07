import { GetQuestionBySlugService } from "@/domain/forum/application/services/get-question-by-slug";
import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from "@nestjs/common";
import { ResourceNotFoundError } from "@/domain/forum/application/services/errors/resource-not-found-error";
import { QuestionWithDetailsPresenter } from "../presenters/question-with-details-presenter";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

@Controller("/questions/:slug")
export class GetQuestionBySlugController {
  constructor(
    private getQuestionBySlug: GetQuestionBySlugService,
    private prisma: PrismaService,
  ) {}

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
      question: QuestionWithDetailsPresenter.toHTTP(result.value.question),
    };
  }
}
