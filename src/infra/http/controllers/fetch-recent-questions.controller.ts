import { Controller, Get, Query, UseGuards, UsePipes } from "@nestjs/common";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { z } from "zod";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

type PageQueryParam = z.infer<typeof pageQueryParamSchema>;

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @UsePipes(queryValidationPipe)
  async handle(@Query("page") page: PageQueryParam) {
    const PER_PAGE = 10;

    const questions = await this.prisma.question.findMany({
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
      orderBy: {
        createdAt: "desc",
      },
    });

    return { questions };
  }
}
