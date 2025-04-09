import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  childName: text("child_name").notNull(),
  animal: text("animal").notNull(),
  theme: text("theme").notNull(),
  content: text("content").notNull(),
  characterId: integer("character_id"),
  metadata: jsonb("metadata").$type<{
    readingTime: number;
    wordCount: number;
    images?: {
      src: string;
      alt: string;
      position: number;
    }[];
  }>(),
});

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  baseAnimal: text("base_animal").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  customization: jsonb("customization").$type<{
    color: string;
    accessories: string[];
    personality: string;
    specialAbility: string;
    appearance: {
      eyes: string;
      size: string;
      pattern: string;
    };
  }>(),
});

export const insertStorySchema = createInsertSchema(stories).pick({
  childName: true,
  animal: true,
  theme: true,
  content: true,
  metadata: true,
  characterId: true,
});

export const insertCharacterSchema = createInsertSchema(characters).pick({
  name: true,
  baseAnimal: true,
  customization: true,
});

export type InsertStory = z.infer<typeof insertStorySchema>;
export type Story = typeof stories.$inferSelect;

export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Character = typeof characters.$inferSelect;

export const storyThemes = [
  "kindness",
  "friendship",
  "courage",
  "sharing",
  "honesty",
  "patience",
  "responsibility",
] as const;

export const commonAnimals = [
  "lion",
  "elephant",
  "giraffe",
  "penguin",
  "owl",
  "rabbit",
  "bear",
  "fox",
  "dolphin",
  "turtle",
] as const;

export const characterColors = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
  "brown",
  "gray",
  "white",
  "black",
  "teal",
  "gold",
  "silver",
] as const;

export const characterEyes = [
  "round",
  "almond",
  "wide",
  "narrow",
  "sparkly",
  "dreamy",
] as const;

export const characterSizes = [
  "tiny",
  "small",
  "medium",
  "large",
  "giant",
] as const;

export const characterPatterns = [
  "plain",
  "spotted",
  "striped",
  "swirled",
  "starry",
  "rainbow",
] as const;

export const characterAccessories = [
  "hat",
  "glasses",
  "scarf",
  "bowtie",
  "necklace",
  "backpack",
  "cape",
  "crown",
  "wand",
  "wings",
] as const;

export const characterPersonalities = [
  "friendly",
  "brave",
  "shy",
  "curious",
  "playful",
  "wise",
  "mischievous",
  "gentle",
  "adventurous",
  "creative",
] as const;

export const characterAbilities = [
  "flying",
  "invisibility",
  "talking to plants",
  "healing",
  "making rainbows",
  "glowing in the dark",
  "changing colors",
  "super strength",
  "time freezing",
  "making things float",
] as const;
