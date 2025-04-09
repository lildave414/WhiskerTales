import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStorySchema, insertCharacterSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Story Routes
  // ------------
  
  app.post("/api/stories", async (req, res) => {
    try {
      const storyData = insertStorySchema.parse(req.body);
      const story = await storage.createStory(storyData);
      res.json(story);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid story data", details: error.errors });
      } else {
        res.status(400).json({ error: "Invalid story data" });
      }
    }
  });

  app.get("/api/stories/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const story = await storage.getStory(id);
    if (!story) {
      res.status(404).json({ error: "Story not found" });
      return;
    }
    res.json(story);
  });

  app.get("/api/stories", async (_req, res) => {
    const stories = await storage.listStories();
    res.json(stories);
  });

  // Character Routes
  // ---------------
  
  // List all characters
  app.get("/api/characters", async (_req, res) => {
    const characters = await storage.listCharacters();
    res.json(characters);
  });
  
  // Get character by ID
  app.get("/api/characters/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    
    const character = await storage.getCharacter(id);
    if (!character) {
      res.status(404).json({ error: "Character not found" });
      return;
    }
    
    res.json(character);
  });
  
  // Create a new character
  app.post("/api/characters", async (req, res) => {
    try {
      const characterData = insertCharacterSchema.parse(req.body);
      const character = await storage.createCharacter(characterData);
      res.json(character);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid character data", details: error.errors });
      } else {
        res.status(400).json({ error: "Invalid character data" });
      }
    }
  });
  
  // Update an existing character
  app.patch("/api/characters/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    
    try {
      // Partial validation - only validate the fields that are provided
      const updateData = req.body;
      const character = await storage.updateCharacter(id, updateData);
      
      if (!character) {
        res.status(404).json({ error: "Character not found" });
        return;
      }
      
      res.json(character);
    } catch (error) {
      res.status(500).json({ error: "Failed to update character" });
    }
  });
  
  // Delete a character
  app.delete("/api/characters/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    
    const success = await storage.deleteCharacter(id);
    if (!success) {
      res.status(404).json({ error: "Character not found" });
      return;
    }
    
    res.status(204).end();
  });

  const httpServer = createServer(app);
  return httpServer;
}
