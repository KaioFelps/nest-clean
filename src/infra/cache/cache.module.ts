import { Module } from "@nestjs/common";
import { RedisService } from "./redis/redis.service";
import { ICacheRepository } from "./cache-repository";
import { RedisCacheRepository } from "./redis/redis-cache-repository";
import { EnvModule } from "../env/env.module";

@Module({
  imports: [EnvModule],
  providers: [
    RedisService,
    { provide: ICacheRepository, useClass: RedisCacheRepository },
  ],
  exports: [ICacheRepository],
})
export class CacheModule {}
