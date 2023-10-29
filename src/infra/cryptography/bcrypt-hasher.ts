import { IHashComparer } from "@/domain/forum/application/cryptography/hash-comparor";
import { IHashGenerator } from "@/domain/forum/application/cryptography/hash-generator";
import { Injectable } from "@nestjs/common";
import { hash, compare } from "bcryptjs";

@Injectable()
export class BcryptHasher implements IHashGenerator, IHashComparer {
  private readonly HASH_SALT = 8;

  async hash(plain: string): Promise<string> {
    return await hash(plain, this.HASH_SALT);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return await compare(plain, hash);
  }
}
