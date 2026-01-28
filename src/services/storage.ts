/**
 * Storage Service - Handles persistent storage of collections, environments, etc.
 * Data is stored in ~/.termin-api/ directory
 */

import fs from "fs";
import path from "path";
import os from "os";
import type { Collection, Environment, Config, HistoryEntry } from "../types";

export class StorageService {
  private static instance: StorageService;
  private baseDir: string;
  private collectionsDir: string;
  private environmentsDir: string;
  private configPath: string;
  private historyPath: string;

  private constructor() {
    // Setup directories
    this.baseDir = path.join(os.homedir(), ".termin-api");
    this.collectionsDir = path.join(this.baseDir, "collections");
    this.environmentsDir = path.join(this.baseDir, "environments");
    this.configPath = path.join(this.baseDir, "config.json");
    this.historyPath = path.join(this.baseDir, "history.json");

    this.ensureDirectories();
  }

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  private ensureDirectories(): void {
    // Create base directory and subdirectories if they don't exist
    [this.baseDir, this.collectionsDir, this.environmentsDir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Create default config if doesn't exist
    if (!fs.existsSync(this.configPath)) {
      const defaultConfig: Config = {
        theme: "dark",
        defaultTimeout: 30000,
        followRedirects: true,
        validateSSL: true,
        maxHistorySize: 100,
      };
      this.saveConfig(defaultConfig);
    }

    // Create empty history if doesn't exist
    if (!fs.existsSync(this.historyPath)) {
      fs.writeFileSync(this.historyPath, JSON.stringify([], null, 2));
    }
  }

  // Collection Management
  loadCollections(): Collection[] {
    try {
      const files = fs.readdirSync(this.collectionsDir);
      const collections: Collection[] = [];

      files.forEach((file) => {
        if (file.endsWith(".json")) {
          const filePath = path.join(this.collectionsDir, file);
          const content = fs.readFileSync(filePath, "utf-8");
          collections.push(JSON.parse(content));
        }
      });

      return collections;
    } catch (error) {
      console.error("Error loading collections:", error);
      return [];
    }
  }

  saveCollection(collection: Collection): void {
    try {
      const fileName = `${collection.id}.json`;
      const filePath = path.join(this.collectionsDir, fileName);

      collection.updatedAt = new Date().toISOString();

      fs.writeFileSync(filePath, JSON.stringify(collection, null, 2));
    } catch (error) {
      console.error("Error saving collection:", error);
      throw error;
    }
  }

  deleteCollection(collectionId: string): void {
    try {
      const fileName = `${collectionId}.json`;
      const filePath = path.join(this.collectionsDir, fileName);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error("Error deleting collection:", error);
      throw error;
    }
  }

  // Environment Management
  loadEnvironments(): Environment[] {
    try {
      const files = fs.readdirSync(this.environmentsDir);
      const environments: Environment[] = [];

      files.forEach((file) => {
        if (file.endsWith(".json")) {
          const filePath = path.join(this.environmentsDir, file);
          const content = fs.readFileSync(filePath, "utf-8");
          environments.push(JSON.parse(content));
        }
      });

      return environments;
    } catch (error) {
      console.error("Error loading environments:", error);
      return [];
    }
  }

  saveEnvironment(environment: Environment): void {
    try {
      const fileName = `${environment.id}.json`;
      const filePath = path.join(this.environmentsDir, fileName);

      fs.writeFileSync(filePath, JSON.stringify(environment, null, 2));
    } catch (error) {
      console.error("Error saving environment:", error);
      throw error;
    }
  }

  deleteEnvironment(environmentId: string): void {
    try {
      const fileName = `${environmentId}.json`;
      const filePath = path.join(this.environmentsDir, fileName);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error("Error deleting environment:", error);
      throw error;
    }
  }

  // Config Management
  loadConfig(): Config {
    try {
      const content = fs.readFileSync(this.configPath, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      console.error("Error loading config:", error);
      return {
        theme: "dark",
        defaultTimeout: 30000,
        followRedirects: true,
        validateSSL: true,
        maxHistorySize: 100,
      };
    }
  }

  saveConfig(config: Config): void {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
    } catch (error) {
      console.error("Error saving config:", error);
      throw error;
    }
  }

  // History Management
  loadHistory(): HistoryEntry[] {
    try {
      const content = fs.readFileSync(this.historyPath, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      console.error("Error loading history:", error);
      return [];
    }
  }

  addToHistory(entry: HistoryEntry): void {
    try {
      const history = this.loadHistory();
      const config = this.loadConfig();

      // Add new entry at the beginning
      history.unshift(entry);

      // Trim to max size
      if (history.length > config.maxHistorySize) {
        history.splice(config.maxHistorySize);
      }

      fs.writeFileSync(this.historyPath, JSON.stringify(history, null, 2));
    } catch (error) {
      console.error("Error adding to history:", error);
    }
  }

  clearHistory(): void {
    try {
      fs.writeFileSync(this.historyPath, JSON.stringify([], null, 2));
    } catch (error) {
      console.error("Error clearing history:", error);
      throw error;
    }
  }

  // Import/Export
  exportCollection(collectionId: string, outputPath: string): void {
    try {
      const fileName = `${collectionId}.json`;
      const sourcePath = path.join(this.collectionsDir, fileName);

      if (fs.existsSync(sourcePath)) {
        const content = fs.readFileSync(sourcePath, "utf-8");
        fs.writeFileSync(outputPath, content);
      } else {
        throw new Error("Collection not found");
      }
    } catch (error) {
      console.error("Error exporting collection:", error);
      throw error;
    }
  }

  importCollection(sourcePath: string): Collection {
    try {
      const content = fs.readFileSync(sourcePath, "utf-8");
      const collection: Collection = JSON.parse(content);

      // Generate new ID to avoid conflicts
      collection.id = `col_${Date.now()}`;
      collection.createdAt = new Date().toISOString();
      collection.updatedAt = new Date().toISOString();

      this.saveCollection(collection);
      return collection;
    } catch (error) {
      console.error("Error importing collection:", error);
      throw error;
    }
  }

  // Utility methods
  getStoragePath(): string {
    return this.baseDir;
  }

  getStorageSize(): number {
    try {
      let totalSize = 0;

      const calculateDirSize = (dir: string) => {
        const files = fs.readdirSync(dir);
        files.forEach((file) => {
          const filePath = path.join(dir, file);
          const stats = fs.statSync(filePath);
          if (stats.isDirectory()) {
            calculateDirSize(filePath);
          } else {
            totalSize += stats.size;
          }
        });
      };

      calculateDirSize(this.baseDir);
      return totalSize;
    } catch (error) {
      console.error("Error calculating storage size:", error);
      return 0;
    }
  }
}
