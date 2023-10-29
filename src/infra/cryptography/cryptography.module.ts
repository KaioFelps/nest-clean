import { Module } from "@nestjs/common";
import { BcryptHasher } from "./bcrypt-hasher";
import { JwtEncrypter } from "./jwt-encrypter";
import { IHashComparer } from "@/domain/forum/application/cryptography/hash-comparor";
import { IHashGenerator } from "@/domain/forum/application/cryptography/hash-generator";
import { IEncrypter } from "@/domain/forum/application/cryptography/encrypter";

@Module({
  providers: [
    { provide: IHashComparer, useClass: BcryptHasher },
    { provide: IHashGenerator, useClass: BcryptHasher },
    { provide: IEncrypter, useClass: JwtEncrypter },
  ],
  exports: [IEncrypter, IHashGenerator, IHashComparer],
})
export class CryptographyModule {}
