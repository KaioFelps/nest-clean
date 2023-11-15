import { Controller, Put, Param, Body, HttpCode } from "@nestjs/common";
import { EditQuestionService } from "@/domain/forum/application/services/edit-question";
import { IQuestionRepository } from "@/domain/forum/application/repositories/question-repository";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { userTokenPayload } from "@/infra/auth/jwt.strategy";

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema);

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;

@Controller("/questions/edit/:id")
export class EditQuestionController {
  constructor(
    private questionRepository: IQuestionRepository,
    private editQuestionService: EditQuestionService,
  ) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param("id") questionId: string,
    @Body(bodyValidationPipe) { content, title }: EditQuestionBodySchema,
    @CurrentUser() user: userTokenPayload,
  ) {
    const userId = user.sub;
    await this.editQuestionService.execute({
      attachmentIds: [],
      authorId: userId,
      content,
      questionId,
      title,
    });
  }
}
