#!/usr/bin/env node

/**
 * Termin API - Entry Point
 * OpenTUI-based Terminal API Client
 */

import { render } from "@opentui/core";
import App from "./App";
import { Command } from "commander";
import { StorageService } from "./services/storage";
import chalk from "chalk";
import gradient from "gradient-string";

const program = new Command();

// ASCII Art Banner
const banner = gradient.pastel.multiline(
  [
    "╔════════════════════════════════════════╗",
    "║                                        ║",
    "║     ⚡ TERMIN API ⚡                   ║",
    "║     Terminal API Client                ║",
    "║                                        ║",
    "╚════════════════════════════════════════╝",
  ].join("\n"),
);

program
  .name("termin-api")
  .description("Modern API testing tool for terminal - Like Postman but in CLI")
  .version("1.0.0");

// Default command - Launch TUI
program.action(() => {
  console.clear();
  console.log(banner);
  console.log(chalk.dim("\nLoading... Press Ctrl+C to exit\n"));

  // Small delay for effect
  setTimeout(() => {
    render(App, {});
  }, 500);
});

// List collections
program
  .command("list")
  .description("List all collections")
  .action(() => {
    const storage = StorageService.getInstance();
    const collections = storage.loadCollections();

    console.log(chalk.bold.cyan("\n📁 Collections:\n"));

    if (collections.length === 0) {
      console.log(chalk.dim("  No collections found"));
      console.log(chalk.dim("  Create one by running: termin-api\n"));
    } else {
      collections.forEach((col, index) => {
        console.log(chalk.green(`  ${index + 1}. ${col.name}`));
        console.log(chalk.dim(`     ID: ${col.id}`));
        console.log(chalk.dim(`     Requests: ${col.requests.length}`));
        console.log();
      });
    }
  });

// Import collection
program
  .command("import <file>")
  .description("Import a Postman collection")
  .action((file: string) => {
    try {
      const storage = StorageService.getInstance();
      const collection = storage.importCollection(file);

      console.log(chalk.green("\n✓ Successfully imported collection!"));
      console.log(chalk.dim(`  Name: ${collection.name}`));
      console.log(chalk.dim(`  Requests: ${collection.requests.length}`));
      console.log(chalk.dim(`  ID: ${collection.id}\n`));
    } catch (error: any) {
      console.error(chalk.red("\n✗ Import failed:"), error.message, "\n");
      process.exit(1);
    }
  });

// Export collection
program
  .command("export <collection-id>")
  .description("Export a collection")
  .option("-o, --output <file>", "Output file path")
  .action((collectionId: string, options: { output?: string }) => {
    try {
      const storage = StorageService.getInstance();
      const outputPath = options.output || `${collectionId}.json`;

      storage.exportCollection(collectionId, outputPath);

      console.log(chalk.green("\n✓ Successfully exported collection!"));
      console.log(chalk.dim(`  File: ${outputPath}\n`));
    } catch (error: any) {
      console.error(chalk.red("\n✗ Export failed:"), error.message, "\n");
      process.exit(1);
    }
  });

// Clear history
program
  .command("clear-history")
  .description("Clear request history")
  .action(() => {
    const storage = StorageService.getInstance();
    storage.clearHistory();
    console.log(chalk.green("\n✓ History cleared\n"));
  });

// Show storage info
program
  .command("info")
  .description("Show storage information")
  .action(() => {
    const storage = StorageService.getInstance();
    const collections = storage.loadCollections();
    const environments = storage.loadEnvironments();
    const history = storage.loadHistory();
    const storageSize = storage.getStorageSize();
    const storagePath = storage.getStoragePath();

    console.log(chalk.bold.cyan("\n📊 Storage Information:\n"));
    console.log(chalk.dim(`  Location: ${storagePath}`));
    console.log(chalk.dim(`  Size: ${(storageSize / 1024).toFixed(2)} KB`));
    console.log();
    console.log(chalk.dim(`  Collections: ${collections.length}`));
    console.log(chalk.dim(`  Environments: ${environments.length}`));
    console.log(chalk.dim(`  History entries: ${history.length}`));
    console.log();
  });

// Run a saved request
program
  .command("run <request-id>")
  .description("Run a saved request")
  .option("-e, --env <environment>", "Use specific environment")
  .action(async (requestId: string, options: { env?: string }) => {
    try {
      const storage = StorageService.getInstance();
      const collections = storage.loadCollections();

      // Find request
      let foundRequest = null;
      let foundCollection = null;

      for (const col of collections) {
        const req = col.requests.find((r) => r.id === requestId);
        if (req) {
          foundRequest = req;
          foundCollection = col;
          break;
        }
      }

      if (!foundRequest) {
        console.error(chalk.red(`\n✗ Request not found: ${requestId}\n`));
        process.exit(1);
      }

      console.log(chalk.cyan(`\n⚡ Running: ${foundRequest.name}`));
      console.log(chalk.dim(`   ${foundRequest.method} ${foundRequest.url}\n`));

      // Load environment variables if specified
      let envVars = foundCollection?.variables || {};
      if (options.env) {
        const environments = storage.loadEnvironments();
        const env = environments.find(
          (e) => e.id === options.env || e.name === options.env,
        );
        if (env) {
          envVars = { ...envVars, ...env.variables };
        }
      }

      // Execute request
      const { HttpService } = await import("./services/http");
      const httpService = new HttpService();

      const startTime = Date.now();
      const response = await httpService.sendRequest(foundRequest, envVars);
      const duration = Date.now() - startTime;

      // Display response
      console.log(chalk.green(`✓ Response received (${duration}ms)`));
      console.log(
        chalk.dim(`  Status: ${response.status} ${response.statusText}`),
      );
      console.log(chalk.dim(`  Size: ${response.size} bytes\n`));

      console.log(chalk.bold("Response:"));
      console.log(JSON.stringify(response.data, null, 2));
      console.log();
    } catch (error: any) {
      console.error(chalk.red("\n✗ Request failed:"), error.message, "\n");
      process.exit(1);
    }
  });

// Parse CLI arguments
program.parse();
