import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { StudentAlreadyExistsError } from "@/domain/forum/application/services/errors/student-already-exists-error";
import { RegisterStudentService } from "@/domain/forum/application/services/register-student";
import { PublicRoute } from "@/infra/auth/public-route-decorator";

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller("/accounts")
@PublicRoute()
@UsePipes(new ZodValidationPipe(createAccountBodySchema))
export class CreateAccountController {
  constructor(private registerStudentService: RegisterStudentService) {}

  @Post()
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = createAccountBodySchema.parse(body);

    const response = await this.registerStudentService.execute({
      email,
      name,
      password,
    });

    if (response.isLeft()) {
      const error = response.value;

      switch (error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message);
          break;
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
