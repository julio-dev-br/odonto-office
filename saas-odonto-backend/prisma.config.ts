// Carrega automaticamente todas as variáveis do seu arquivo .env para a memória do Prisma
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Agora o env("DATABASE_URL") vai achar a configuração do seu arquivo .env perfeitamente!
    url: env("DATABASE_URL"),
  },
});
