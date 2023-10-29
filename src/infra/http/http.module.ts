import { Module } from "@nestjs/common";
import { CreateAccountController } from "./controllers/create-account.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { FetchRecentQuestionsController } from "./controllers/fetch-recent-questions.controller";
import { DatabaseModule } from "../database/database.module";
import { CreateQuestionService } from "@/domain/forum/application/services/create-question";
import { FetchLatestQuestionsService } from "@/domain/forum/application/services/fetch-latest-questions";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { AuthenticateStudentService } from "@/domain/forum/application/services/authenticate-student";
import { RegisterStudentService } from "@/domain/forum/application/services/register-student";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [
    CreateQuestionService,
    FetchLatestQuestionsService,
    AuthenticateStudentService,
    RegisterStudentService,
  ],
})
export class HttpModule {}
