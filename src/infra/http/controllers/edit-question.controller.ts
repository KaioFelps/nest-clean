import {
  Controller,
  Put,
  Param,
  Body,
  HttpCode,
  BadRequestException,
} from "@nestjs/common";
import { EditQuestionService } from "@/domain/forum/application/services/edit-question";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { userTokenPayload } from "@/infra/auth/jwt.strategy";

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.string().uuid().array(),
});

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema);

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;

@Controller("/questions/edit/:id")
export class EditQuestionController {
  constructor(private editQuestionService: EditQuestionService) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param("id") questionId: string,
    @Body(bodyValidationPipe)
    { content, title, attachments }: EditQuestionBodySchema,
    @CurrentUser() user: userTokenPayload,
  ) {
    const userId = user.sub;

    const result = await this.editQuestionService.execute({
      attachmentsIds: attachments,
      authorId: userId,
      content,
      questionId,
      title,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
