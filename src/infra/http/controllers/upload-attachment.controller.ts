import { InvalidAttachmentType } from "@/domain/forum/application/services/errors/invalid-attachment-type";
import { UploadAndCreateAttachmentService } from "@/domain/forum/application/services/upload-and-create-attachment";
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("/attachments")
export class UploadAttachmentController {
  constructor(
    private uploadAndCreateAttachment: UploadAndCreateAttachmentService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor("file")) // file é o nome do arquivo que enviaremos
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // 1024 bytes * 1024 bytes = 1mb * 2 = 2mb
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
          new FileTypeValidator({ fileType: ".(png|jpeg|jpg|pdf)" }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.uploadAndCreateAttachment.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case InvalidAttachmentType:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { attachment } = result.value;
    return { attachmentId: attachment.id.toString() };
  }
}
