import { Body, Controller, Param, Post } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { userTokenPayload } from "@/infra/auth/jwt.strategy";
import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { CommentOnAnswerService } from "@/domain/forum/application/services/comment-on-answer";

const commentonAnswerBodySchema = z.object({
  content: z.string(),
});

const answerIdParamSchema = z.string().uuid();

type CommentOnAnswerBody = z.infer<typeof commentonAnswerBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(commentonAnswerBodySchema);
const paramValidationPipe = new ZodValidationPipe(answerIdParamSchema);

@Controller("/answers/:answerId/comment")
export class CommentOnAnswerController {
  constructor(private commentonAnswer: CommentOnAnswerService) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CommentOnAnswerBody,
    @Param("answerId", paramValidationPipe) answerId: string,
    @CurrentUser() user: userTokenPayload,
  ) {
    const { content } = body;

    await this.commentonAnswer.execute({
      content,
      authorId: user.sub,
      answerId,
    });
  }
}
