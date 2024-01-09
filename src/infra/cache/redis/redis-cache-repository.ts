import { Injectable } from "@nestjs/common";
import { ICacheRepository } from "../cache-repository";
import { RedisService } from "./redis.service";

@Injectable()
export class RedisCacheRepository implements ICacheRepository {
  constructor(private redis: RedisService) {}

  async set(key: string, value: string): Promise<void> {
    const tenMinutesInSeconds = 60 * 10;

    try {
      await this.redis.set(key, value, "EX", tenMinutesInSeconds);
    } catch (error) {
      console.log(error);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.redis.get(key);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.log(error);
    }
  }
}
