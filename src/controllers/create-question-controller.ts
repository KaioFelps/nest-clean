import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { PrismaService } from "src/prisma/prisma.service";
import { CurrentUser } from "src/auth/current-user-decorator";
import { userTokenPayload } from "src/auth/jwt.strategy";
import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>;

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBody,
    @CurrentUser() user: userTokenPayload,
  ) {
    const { title, content } = body;

    await this.prisma.question.create({
      data: {
        authorId: user.sub,
        title,
        content,
        slug: title
          .toLowerCase()
          .normalize("NFD")
          .trimStart()
          .trimEnd()
          .replaceAll(" ", "_")
          .replaceAll(/__+/g, ""),
      },
    });
  }
}
