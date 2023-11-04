import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UsePipes,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { FetchLatestQuestionsService } from "@/domain/forum/application/services/fetch-latest-questions";
import { QuestionPresenter } from "../presenters/question-presenter";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

type PageQueryParam = z.infer<typeof pageQueryParamSchema>;

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

@Controller("/questions")
// @UseGuards(JwtAuthGuard)
// não é mais necessário, pois um guard global foi setado no auth module
export class FetchRecentQuestionsController {
  constructor(private fetchLatestQuestions: FetchLatestQuestionsService) {}

  @Get()
  @UsePipes(queryValidationPipe)
  async handle(@Query("page") page: PageQueryParam) {
    const response = await this.fetchLatestQuestions.execute({
      page,
    });

    const mappedQuestions: unknown[] = [];

    if (response.isLeft()) {
      throw new BadRequestException();
    }

    const questions = response.value.questions;

    for (let i = 0; i < questions.length; i++) {
      mappedQuestions.push(QuestionPresenter.toHTTP(questions[i]));
    }

    return { questions: mappedQuestions };
  }
}
