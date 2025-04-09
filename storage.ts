import { 
  stories, 
  type Story, 
  type InsertStory,
  type Character,
  type InsertCharacter
} from "@shared/schema";

export interface IStorage {
  // Story methods
  getStory(id: number): Promise<Story | undefined>;
  createStory(story: InsertStory): Promise<Story>;
  listStories(): Promise<Story[]>;
  
  // Character methods
  getCharacter(id: number): Promise<Character | undefined>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  listCharacters(): Promise<Character[]>;
  updateCharacter(id: number, character: Partial<InsertCharacter>): Promise<Character | undefined>;
  deleteCharacter(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private stories: Map<number, Story>;
  private characters: Map<number, Character>;
  private storyId: number;
  private characterId: number;

  constructor() {
    this.stories = new Map();
    this.characters = new Map();
    this.storyId = 1;
    this.characterId = 1;
  }

  // Story methods
  async getStory(id: number): Promise<Story | undefined> {
    return this.stories.get(id);
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const id = this.storyId++;
    const story: Story = { ...insertStory, id };
    this.stories.set(id, story);
    return story;
  }

  async listStories(): Promise<Story[]> {
    return Array.from(this.stories.values());
  }
  
  // Character methods
  async getCharacter(id: number): Promise<Character | undefined> {
    return this.characters.get(id);
  }
  
  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const id = this.characterId++;
    const createdAt = new Date();
    const character: Character = { ...insertCharacter, id, createdAt };
    this.characters.set(id, character);
    return character;
  }
  
  async listCharacters(): Promise<Character[]> {
    return Array.from(this.characters.values());
  }
  
  async updateCharacter(id: number, characterUpdate: Partial<InsertCharacter>): Promise<Character | undefined> {
    const character = this.characters.get(id);
    if (!character) return undefined;
    
    const updatedCharacter: Character = {
      ...character,
      ...characterUpdate,
    };
    
    this.characters.set(id, updatedCharacter);
    return updatedCharacter;
  }
  
  async deleteCharacter(id: number): Promise<boolean> {
    return this.characters.delete(id);
  }
}

export const storage = new MemStorage();
