import {
  Controller,
  Put,
  Param,
  Body,
  HttpCode,
  BadRequestException,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { userTokenPayload } from "@/infra/auth/jwt.strategy";
import { EditAnswerService } from "@/domain/forum/application/services/edit-answer";

const editAnswerBodySchema = z.object({
  content: z.string(),
  attachments: z.string().uuid().array(),
});

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema);

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>;

@Controller("/answers/edit/:id")
export class EditAnswerController {
  constructor(private editAnswerService: EditAnswerService) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) { content, attachments }: EditAnswerBodySchema,
    @Param("id") answerId: string,
    @CurrentUser() user: userTokenPayload,
  ) {
    const userId = user.sub;

    const result = await this.editAnswerService.execute({
      answerId,
      attachmentIds: attachments,
      authorId: userId,
      content,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
