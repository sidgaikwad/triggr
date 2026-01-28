/**
 * Type definitions for Termin API
 */

// HTTP Methods
export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

// Auth Types
export type AuthType =
  | "none"
  | "bearer"
  | "basic"
  | "apikey"
  | "oauth2"
  | "jwt";

// Body Types
export type BodyType =
  | "none"
  | "json"
  | "form-data"
  | "x-www-form-urlencoded"
  | "raw"
  | "graphql";

// Request Parameter
export interface Param {
  key: string;
  value: string;
  enabled: boolean;
  description?: string;
}

// Request Header
export interface Header {
  key: string;
  value: string;
  enabled: boolean;
}

// Authentication Configuration
export interface Auth {
  type: AuthType;
  bearer?: {
    token: string;
  };
  basic?: {
    username: string;
    password: string;
  };
  apiKey?: {
    key: string;
    value: string;
    addTo: "header" | "query";
  };
  oauth2?: {
    grantType: "client_credentials" | "authorization_code" | "password";
    clientId: string;
    clientSecret: string;
    accessTokenUrl: string;
    scope?: string;
  };
  jwt?: {
    token: string;
    algorithm: string;
  };
}

// Request Body
export interface RequestBody {
  type: BodyType;
  raw?: string;
  json?: any;
  formData?: Array<{ key: string; value: string; type: "text" | "file" }>;
  graphql?: {
    query: string;
    variables?: any;
  };
}

// Request Definition
export interface Request {
  id: string;
  name: string;
  description?: string;
  method: HttpMethod;
  url: string;
  params: Param[];
  headers: Header[];
  body: RequestBody | null;
  auth: Auth | null;
  preRequestScript?: string;
  tests?: string;
  createdAt: string;
  updatedAt: string;
}

// Response Definition
export interface Response {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  time: number; // in milliseconds
  size: number; // in bytes
}

// Folder Definition
export interface Folder {
  id: string;
  name: string;
  requests: string[]; // Array of request IDs
  folders?: Folder[]; // Nested folders
}

// Collection Definition
export interface Collection {
  id: string;
  name: string;
  description?: string;
  version?: string;
  requests: Request[];
  folders: Folder[];
  variables: Record<string, string>;
  auth?: Auth; // Collection-level auth
  createdAt: string;
  updatedAt: string;
}

// Environment Definition
export interface Environment {
  id: string;
  name: string;
  variables: Record<string, string>;
  isActive?: boolean;
}

// History Entry
export interface HistoryEntry {
  id: string;
  request: Request;
  response: Response;
  timestamp: string;
}

// Config
export interface Config {
  theme: "dark" | "light";
  defaultTimeout: number;
  followRedirects: boolean;
  validateSSL: boolean;
  proxyUrl?: string;
  maxHistorySize: number;
}

// Storage Schema
export interface StorageSchema {
  collections: Collection[];
  environments: Environment[];
  history: HistoryEntry[];
  config: Config;
}

// UI State Types
export type TabType = "params" | "auth" | "headers" | "body" | "tests";
export type ViewType = "main" | "help" | "environments" | "settings";
