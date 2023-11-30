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
import { GetQuestionBySlugController } from "./controllers/get-question-by-slug.controller";
import { GetQuestionBySlugService } from "@/domain/forum/application/services/get-question-by-slug";
import { EditQuestionController } from "./controllers/edit-question.controller";
import { EditQuestionService } from "@/domain/forum/application/services/edit-question";
import { DeleteQuestionController } from "./controllers/delete-question.controller";
import { DeleteQuestionService } from "@/domain/forum/application/services/delete-question";
import { AnswerQuestionController } from "./controllers/answer-question.controller";
import { AnswerQuestionService } from "@/domain/forum/application/services/answer-question";
import { EditAnswerController } from "./controllers/edit-answer.controller";
import { EditAnswerService } from "@/domain/forum/application/services/edit-answer";
import { DeleteAnswerService } from "@/domain/forum/application/services/delete-answer";
import { DeleteAnswerController } from "./controllers/delete-answer.controller";
import { FetchQuestionAnswersController } from "./controllers/fetch-question-answers.controller";
import { FetchQuestionAnswersService } from "@/domain/forum/application/services/fetch-question-answers";
import { ChooseBestAnswerController } from "./controllers/choose-best-answer.controller";
import { ChooseBestAnswerService } from "@/domain/forum/application/services/choose-best-answer";
import { CommentOnQuestionService } from "@/domain/forum/application/services/comment-on-question";
import { CommentOnQuestionController } from "./controllers/comment-on-question.controller";
import { DeleteQuestionCommentController } from "./controllers/delete-question-comment.controller";
import { DeleteQuestionCommentService } from "@/domain/forum/application/services/delete-question-comment";
import { CommentOnAnswerController } from "./controllers/comment-on-answer.controller";
import { CommentOnAnswerService } from "@/domain/forum/application/services/comment-on-answer";
import { DeleteAnswerCommentController } from "./controllers/delete-answer-comment.controller";
import { DeleteAnswerCommentService } from "@/domain/forum/application/services/delete-answer-comment";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
    DeleteAnswerController,
    FetchQuestionAnswersController,
    ChooseBestAnswerController,
    CommentOnQuestionController,
    DeleteQuestionCommentController,
    CommentOnAnswerController,
    DeleteAnswerCommentController,
  ],
  providers: [
    CreateQuestionService,
    FetchLatestQuestionsService,
    AuthenticateStudentService,
    RegisterStudentService,
    GetQuestionBySlugService,
    EditQuestionService,
    DeleteQuestionService,
    AnswerQuestionService,
    EditAnswerService,
    DeleteAnswerService,
    FetchQuestionAnswersService,
    ChooseBestAnswerService,
    CommentOnQuestionService,
    DeleteQuestionCommentService,
    CommentOnAnswerService,
    DeleteAnswerCommentService,
  ],
})
export class HttpModule {}
