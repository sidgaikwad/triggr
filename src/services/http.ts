/**
 * HTTP Service - Handles all API requests (REST, GraphQL, etc.)
 */

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import type { Request, Response, Auth } from "../types";

export class HttpService {
  private defaultTimeout = 30000;

  /**
   * Send an HTTP request
   */
  async sendRequest(
    request: Request,
    envVars: Record<string, string> = {},
  ): Promise<Response> {
    const startTime = Date.now();

    try {
      // Process URL with environment variables
      const processedUrl = this.processVariables(request.url, envVars);

      // Build axios config
      const config: AxiosRequestConfig = {
        method: request.method,
        url: processedUrl,
        timeout: this.defaultTimeout,
        validateStatus: () => true, // Don't throw on any status
      };

      // Add query parameters
      if (request.params.length > 0) {
        const params: Record<string, string> = {};
        request.params
          .filter((p) => p.enabled)
          .forEach((p) => {
            params[p.key] = this.processVariables(p.value, envVars);
          });
        config.params = params;
      }

      // Add headers
      if (request.headers.length > 0) {
        const headers: Record<string, string> = {};
        request.headers
          .filter((h) => h.enabled)
          .forEach((h) => {
            headers[h.key] = this.processVariables(h.value, envVars);
          });
        config.headers = headers;
      }

      // Add authentication
      if (request.auth) {
        this.applyAuth(config, request.auth, envVars);
      }

      // Add body
      if (request.body && ["POST", "PUT", "PATCH"].includes(request.method)) {
        config.data = this.processBody(request.body, envVars);

        // Set content-type if not already set
        if (!config.headers?.["Content-Type"]) {
          if (request.body.type === "json" || request.body.type === "graphql") {
            config.headers = {
              ...config.headers,
              "Content-Type": "application/json",
            };
          } else if (request.body.type === "x-www-form-urlencoded") {
            config.headers = {
              ...config.headers,
              "Content-Type": "application/x-www-form-urlencoded",
            };
          }
        }
      }

      // Execute request
      const response: AxiosResponse = await axios(config);
      const endTime = Date.now();

      // Calculate response size
      const responseSize = JSON.stringify(response.data).length;

      return {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers as Record<string, string>,
        data: response.data,
        time: endTime - startTime,
        size: responseSize,
      };
    } catch (error: any) {
      const endTime = Date.now();

      if (error.response) {
        // Server responded with error
        return {
          status: error.response.status,
          statusText: error.response.statusText,
          headers: error.response.headers,
          data: error.response.data,
          time: endTime - startTime,
          size: 0,
        };
      } else if (error.request) {
        // Request made but no response
        throw new Error(`No response received: ${error.message}`);
      } else {
        // Error in request setup
        throw new Error(`Request failed: ${error.message}`);
      }
    }
  }

  /**
   * Apply authentication to request config
   */
  private applyAuth(
    config: AxiosRequestConfig,
    auth: Auth,
    envVars: Record<string, string>,
  ): void {
    if (!config.headers) {
      config.headers = {};
    }

    switch (auth.type) {
      case "bearer":
        if (auth.bearer) {
          const token = this.processVariables(auth.bearer.token, envVars);
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        break;

      case "basic":
        if (auth.basic) {
          const username = this.processVariables(auth.basic.username, envVars);
          const password = this.processVariables(auth.basic.password, envVars);
          const encoded = Buffer.from(`${username}:${password}`).toString(
            "base64",
          );
          config.headers["Authorization"] = `Basic ${encoded}`;
        }
        break;

      case "apikey":
        if (auth.apiKey) {
          const key = auth.apiKey.key;
          const value = this.processVariables(auth.apiKey.value, envVars);

          if (auth.apiKey.addTo === "header") {
            config.headers[key] = value;
          } else {
            if (!config.params) config.params = {};
            config.params[key] = value;
          }
        }
        break;

      case "jwt":
        if (auth.jwt) {
          const token = this.processVariables(auth.jwt.token, envVars);
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        break;

      // OAuth2 would require a token refresh flow - simplified here
      case "oauth2":
        // In a real implementation, this would check for valid token
        // and refresh if needed
        break;
    }
  }

  /**
   * Process request body based on type
   */
  private processBody(body: any, envVars: Record<string, string>): any {
    if (!body) return null;

    switch (body.type) {
      case "json":
        return this.processVariables(JSON.stringify(body.json), envVars, true);

      case "graphql":
        if (body.graphql) {
          return {
            query: this.processVariables(body.graphql.query, envVars),
            variables: body.graphql.variables || {},
          };
        }
        return null;

      case "raw":
        return this.processVariables(body.raw || "", envVars);

      case "x-www-form-urlencoded":
        const formData: Record<string, string> = {};
        if (body.formData) {
          body.formData.forEach((item: any) => {
            formData[item.key] = this.processVariables(item.value, envVars);
          });
        }
        return new URLSearchParams(formData).toString();

      case "form-data":
        // FormData would require special handling for file uploads
        return body.formData;

      default:
        return null;
    }
  }

  /**
   * Process variables in strings (e.g., {{variable}})
   */
  private processVariables(
    text: string,
    envVars: Record<string, string>,
    parseJSON = false,
  ): any {
    let processed = text;

    // Replace all {{variable}} with values from envVars
    const variableRegex = /\{\{([^}]+)\}\}/g;
    processed = processed.replace(variableRegex, (match, varName) => {
      const trimmedName = varName.trim();
      return envVars[trimmedName] || match;
    });

    // If parsing JSON, return parsed object
    if (parseJSON) {
      try {
        return JSON.parse(processed);
      } catch {
        return processed;
      }
    }

    return processed;
  }

  /**
   * Test connection to a URL
   */
  async testConnection(url: string): Promise<boolean> {
    try {
      await axios.head(url, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get available HTTP methods
   */
  getSupportedMethods(): string[] {
    return ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];
  }
}
