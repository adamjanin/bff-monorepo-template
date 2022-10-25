import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { add } from "date-fns";
import { toDate } from "date-fns-tz";
// Prevent other packages to include their own prisma
export { Prisma } from "@prisma/client";
@Injectable()
export class SQLClient extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: ["warn", "error"],
      errorFormat: "colorless",
    });
  }

  async onModuleInit() {
    if (!process.env.DB_URL) {
      throw new Error("DB_URL is required");
    }
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on("beforeExit", async (event) => {
      console.log(event.name);
      await app.close();
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

export const parseToGMT8 = (date: Date) => {
  return add(date, {
    minutes: 480,
  });
};

export const toDateGmt8 = (dateString: string) => {
  return parseToGMT8(toDate(`${dateString} 'Asia/Kuala_Lumpur'`));
};

export const updateAt = (date: Date) => {
  return { updatedAt: parseToGMT8(date) };
};

export const createAt = (date: Date) => {
  const localDate = parseToGMT8(date);
  return {
    createdAt: localDate,
    updatedAt: localDate,
  };
};
