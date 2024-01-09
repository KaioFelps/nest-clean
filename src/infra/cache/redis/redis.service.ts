import { EnvService } from "@/infra/env/env.service";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Redis } from "ioredis";

@Injectable()
export class RedisService
  extends Redis
  implements OnModuleDestroy, OnModuleInit
{
  constructor(envService: EnvService) {
    super({
      host: envService.get("REDIS_HOST"),
      port: envService.get("REDIS_PORT"),
      db: envService.get("REDIS_DB"),
    });
  }

  //   Redis não precisa de inicialização, ele se inicia assim que é instanciado.
  //   onModuleInit() {
  //     return this.connect();
  //   }

  onModuleInit() {
    this.on("error", (error) => {
      console.log(error);
      this.disconnect();
    });
  }

  onModuleDestroy() {
    this.disconnect();
  }
}
