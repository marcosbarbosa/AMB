import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    try {
      const validationResult = insertContactMessageSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ 
          error: validationError.message 
        });
      }

      const message = await storage.createContactMessage(validationResult.data);
      
      return res.status(201).json(message);
    } catch (error) {
      console.error("Error creating contact message:", error);
      return res.status(500).json({ 
        error: "Erro ao enviar mensagem. Tente novamente mais tarde." 
      });
    }
  });

  app.get("/api/contact", async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      return res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      return res.status(500).json({ 
        error: "Erro ao buscar mensagens." 
      });
    }
  });

  app.get("/api/contact/:id", async (req, res) => {
    try {
      const message = await storage.getContactMessage(req.params.id);
      
      if (!message) {
        return res.status(404).json({ 
          error: "Mensagem não encontrada." 
        });
      }
      
      return res.json(message);
    } catch (error) {
      console.error("Error fetching contact message:", error);
      return res.status(500).json({ 
        error: "Erro ao buscar mensagem." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
