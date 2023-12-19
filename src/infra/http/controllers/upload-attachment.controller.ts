import {
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
  //   constructor() {}

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
    console.log(file);
  }
}
