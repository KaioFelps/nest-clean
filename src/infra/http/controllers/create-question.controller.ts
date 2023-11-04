import { Body, Controller, Post } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { userTokenPayload } from "@/infra/auth/jwt.strategy";
import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { CreateQuestionService } from "@/domain/forum/application/services/create-question";

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>;

@Controller("/questions")
// @UseGuards(JwtAuthGuard)
// não é mais necessário, pois um guard global foi setado no auth module
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionService) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBody,
    @CurrentUser() user: userTokenPayload,
  ) {
    const { title, content } = body;

    await this.createQuestion.execute({
      title,
      content,
      authorId: user.sub,
      attachmentsIds: [],
    });
  }
}
