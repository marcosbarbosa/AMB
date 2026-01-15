/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: index.ts
 * CAMINHO: server/index.ts
 * DATA: 15 de Janeiro de 2026
 * HORA: 16:15
 * FUNÇÃO: Ponto de Entrada do Servidor (Express + Vite)
 * VERSÃO: 1.1 Prime
 * ==========================================================
 */

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Tipagem para o corpo bruto da requisição (útil para Webhooks)
declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}

// Middlewares de Parsing
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// Middleware de Logging (Monitoramento de Rotas API)
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Inicialização do Servidor
(async () => {
  // 1. Registrar Rotas de API
  const server = await registerRoutes(app);

  // 2. Middleware Global de Erro
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // 3. Configuração do Vite (Dev) ou Static (Prod)
  // Importante: Configura o Vite apenas após as rotas de API para não interferir
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // 4. Inicialização da Porta
  // Serve tanto a API quanto o Client (React)
  const port = parseInt(process.env.PORT || '5000', 10);

  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true, // Otimização para Linux/Replit
  }, () => {
    log(`🦅 Servidor Prime rodando na porta ${port}`);
  });
})();