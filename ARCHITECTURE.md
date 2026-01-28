# 🏗️ Termin API - Architecture & Technical Documentation

## System Overview

Termin API is a modern Terminal User Interface (TUI) application built with OpenTUI that provides a Postman-like experience in the terminal with full data persistence and modern animations.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER TERMINAL                           │
│                    (iTerm, Terminal, etc.)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      TERMIN API CLI                             │
│                   (Commander.js Router)                         │
├─────────────────────────────────────────────────────────────────┤
│  Commands:                                                      │
│  • termin-api          → Launch TUI                             │
│  • termin-api list     → List collections                       │
│  • termin-api run      → Execute request                        │
│  • termin-api import   → Import Postman                         │
│  • termin-api export   → Export collection                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    OpenTUI FRAMEWORK                            │
│              (React-like Component System)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    App Component                         │  │
│  │              (Main State Management)                     │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                          │
│       ┌─────────────┼─────────────┐                            │
│       │             │             │                            │
│       ▼             ▼             ▼                            │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                        │
│  │Collection│ │ Request │ │Response │                         │
│  │ Browser │  │ Builder │  │ Viewer  │                         │
│  └─────────┘  └─────────┘  └─────────┘                        │
│       │             │             │                            │
│       ▼             ▼             ▼                            │
│  ┌──────────────────────────────────────┐                     │
│  │      OpenTUI Core Components         │                     │
│  │  • Box  • Text  • Input  • List      │                     │
│  │  • Panel  • Tabs  • Spinner          │                     │
│  └──────────────────────────────────────┘                     │
│                                                                 │
└──────────────┬──────────────────┬───────────────────┬──────────┘
               │                  │                   │
               ▼                  ▼                   ▼
    ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
    │   Storage    │   │     HTTP     │   │     Auth     │
    │   Service    │   │   Service    │   │   Service    │
    └──────┬───────┘   └──────┬───────┘   └──────┬───────┘
           │                  │                   │
           ▼                  ▼                   ▼
    ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
    │ File System  │   │    Axios     │   │   Keytar     │
    │              │   │   (HTTP)     │   │ (Encrypted)  │
    └──────┬───────┘   └──────┬───────┘   └──────────────┘
           │                  │
           ▼                  ▼
    ~/.termin-api/     External APIs
    ├── collections/   (REST, GraphQL,
    ├── environments/   WebSocket, etc.)
    └── config.json
```

---

## Component Architecture

### 1. App Component (Main Container)

```typescript
App
├── State Management
│   ├── collections: Collection[]
│   ├── selectedRequest: Request | null
│   ├── response: Response | null
│   ├── loading: boolean
│   └── environments: Environment[]
│
├── Event Handlers
│   ├── handleSendRequest()
│   ├── handleSaveRequest()
│   ├── handleSelectRequest()
│   └── handleEnvironmentSwitch()
│
└── Child Components
    ├── CollectionBrowser
    ├── RequestBuilder
    ├── ResponseViewer
    ├── StatusBar
    ├── HelpModal
    └── EnvironmentSelector
```

### 2. CollectionBrowser Component

```
CollectionBrowser
├── Purpose: Display and navigate collections
├── Features:
│   ├── Tree view of collections and folders
│   ├── Keyboard navigation (↑/↓)
│   ├── Expand/collapse folders
│   └── Quick actions (+, delete, rename)
└── Props:
    ├── collections: Collection[]
    ├── onSelectRequest: (Request) => void
    └── onSelectCollection: (id) => void
```

### 3. RequestBuilder Component

```
RequestBuilder
├── Purpose: Configure HTTP requests
├── Tabs:
│   ├── Params (query parameters)
│   ├── Auth (authentication)
│   ├── Headers (HTTP headers)
│   ├── Body (request payload)
│   └── Tests (validation scripts)
├── Features:
│   ├── Method selector (GET, POST, etc.)
│   ├── URL input with variable support
│   ├── Send button (Ctrl+Enter)
│   └── Save button (Ctrl+S)
└── State:
    └── activeTab: 'params' | 'auth' | 'headers' | 'body' | 'tests'
```

### 4. ResponseViewer Component

```
ResponseViewer
├── Purpose: Display API responses
├── Features:
│   ├── Syntax highlighting (JSON, XML, HTML)
│   ├── Status code display (color-coded)
│   ├── Response time and size
│   ├── Headers view
│   └── Pretty print / Raw view toggle
└── State:
    ├── response: Response | null
    └── loading: boolean
```

---

## Data Flow Architecture

### Request Sending Flow

```
User Action (Ctrl+Enter)
       ↓
App.handleSendRequest()
       ↓
HttpService.sendRequest()
       ↓
┌──────────────────────────┐
│ 1. Process Variables     │
│    {{var}} → actual value│
└──────────┬───────────────┘
           ↓
┌──────────────────────────┐
│ 2. Apply Authentication  │
│    Add auth headers/     │
│    params                │
└──────────┬───────────────┘
           ↓
┌──────────────────────────┐
│ 3. Build Axios Config    │
│    method, url, headers, │
│    body, params          │
└──────────┬───────────────┘
           ↓
┌──────────────────────────┐
│ 4. Execute HTTP Request  │
│    await axios(config)   │
└──────────┬───────────────┘
           ↓
┌──────────────────────────┐
│ 5. Parse Response        │
│    status, data, headers │
└──────────┬───────────────┘
           ↓
Update UI with Response
       ↓
Optional: Save to History
```

### Data Persistence Flow

```
User Saves Request (Ctrl+S)
       ↓
App.handleSaveRequest()
       ↓
Find/Create Collection
       ↓
Add/Update Request in Collection
       ↓
StorageService.saveCollection()
       ↓
┌────────────────────────────┐
│ Serialize to JSON          │
│ collection.updatedAt = now │
└──────────┬─────────────────┘
           ↓
┌────────────────────────────┐
│ Write to File System       │
│ ~/.termin-api/collections/ │
│ {collection.id}.json       │
└────────────────────────────┘
       ↓
Data Persisted ✓
(Survives app restart!)
```

---

## Service Layer Architecture

### StorageService

```typescript
class StorageService {
  // Singleton pattern
  private static instance: StorageService;

  // Directories
  private baseDir: ~/.termin-api
  private collectionsDir: ~/.termin-api/collections
  private environmentsDir: ~/.termin-api/environments

  // Methods
  + loadCollections(): Collection[]
  + saveCollection(collection): void
  + loadEnvironments(): Environment[]
  + saveEnvironment(env): void
  + importCollection(path): Collection
  + exportCollection(id, path): void
  + getStorageSize(): number
}
```

**Key Features:**

- Singleton pattern (one instance)
- File-based storage (JSON)
- Automatic directory creation
- Error handling and recovery

### HttpService

```typescript
class HttpService {
  // HTTP Methods
  + sendRequest(request, envVars): Promise<Response>
  + testConnection(url): Promise<boolean>

  // Private helpers
  - processVariables(text, vars): string
  - applyAuth(config, auth): void
  - processBody(body, vars): any

  // Supported features
  - REST API (all methods)
  - GraphQL queries/mutations
  - Variable interpolation {{var}}
  - All auth types
  - Request/response transformation
}
```

**Request Processing Pipeline:**

1. Variable substitution (`{{var}}` → value)
2. URL construction
3. Query parameters addition
4. Headers processing
5. Authentication application
6. Body serialization
7. Request execution
8. Response parsing

### AuthService (Future Enhancement)

```typescript
class AuthService {
  // Token management
  + storeToken(token, encrypted): void
  + getToken(key): string
  + refreshToken(oauth): Promise<Token>

  // OAuth flows
  + clientCredentials(config): Promise<Token>
  + authorizationCode(config): Promise<Token>

  // Security
  + encrypt(data): string
  + decrypt(data): string
}
```

---

## File Structure

```
~/.termin-api/                    # User data directory
│
├── collections/                  # All saved collections
│   ├── col_1706345678901.json   # Collection file (JSON)
│   ├── col_1706345678902.json
│   └── col_1706345678903.json
│
├── environments/                 # Environment variables
│   ├── env_dev.json             # Development environment
│   ├── env_staging.json         # Staging environment
│   └── env_production.json      # Production environment
│
├── auth/                         # Encrypted credentials
│   └── credentials.enc          # Encrypted auth tokens
│
├── config.json                   # Global configuration
├── history.json                  # Request history (last 100)
└── cache/                        # Response cache (optional)
    └── *.cache
```

### Collection File Format

```json
{
  "id": "col_1706345678901",
  "name": "My API Collection",
  "description": "Collection for testing my API",
  "version": "1.0.0",
  "createdAt": "2026-01-27T10:30:00Z",
  "updatedAt": "2026-01-27T15:45:00Z",
  "variables": {
    "base_url": "https://api.example.com",
    "api_version": "v1"
  },
  "auth": {
    "type": "bearer",
    "bearer": {
      "token": "{{auth_token}}"
    }
  },
  "folders": [
    {
      "id": "fol_users",
      "name": "Users",
      "requests": ["req_1", "req_2"]
    }
  ],
  "requests": [
    {
      "id": "req_1",
      "name": "Get All Users",
      "method": "GET",
      "url": "{{base_url}}/{{api_version}}/users",
      "params": [
        { "key": "page", "value": "1", "enabled": true },
        { "key": "limit", "value": "10", "enabled": true }
      ],
      "headers": [
        { "key": "Accept", "value": "application/json", "enabled": true }
      ],
      "body": null,
      "auth": null,
      "createdAt": "2026-01-27T10:30:00Z",
      "updatedAt": "2026-01-27T10:30:00Z"
    }
  ]
}
```

---

## State Management

### App State Structure

```typescript
interface AppState {
  // Collections data
  collections: Collection[];
  selectedCollection: string | null;

  // Current request
  selectedRequest: Request | null;
  requestDirty: boolean; // Has unsaved changes

  // Response data
  response: Response | null;
  loading: boolean;

  // Environments
  environments: Environment[];
  activeEnvironment: string; // 'none' | env.id

  // UI state
  activeView: "main" | "help" | "environments" | "settings";
  activeTab: "params" | "auth" | "headers" | "body" | "tests";

  // Status
  statusMessage: string;

  // History
  history: HistoryEntry[];
}
```

### State Update Flow

```
User Action
    ↓
Event Handler
    ↓
this.setState({ ... })
    ↓
OpenTUI Re-renders Component
    ↓
UI Updates
```

---

## Keyboard Event System

```typescript
// Global shortcuts (App level)
Ctrl+C     → Exit application
Ctrl+N     → New request
Ctrl+S     → Save request
Ctrl+Enter → Send request
F1         → Help modal
F2         → Environment selector
Esc        → Close modal / Cancel

// Navigation shortcuts
Tab        → Next field
Shift+Tab  → Previous field
↑/↓        → Navigate lists
Enter      → Select item

// Tab shortcuts (RequestBuilder)
Alt+1      → Params tab
Alt+2      → Auth tab
Alt+3      → Headers tab
Alt+4      → Body tab
Alt+5      → Tests tab

// Collection shortcuts
Ctrl+F     → Search collections
+          → New collection
Delete     → Delete selected item
```

### Event Handler Implementation

```typescript
componentDidMount() {
  // Register keyboard listeners
  this.on('key:ctrl+enter', async () => {
    if (this.state.selectedRequest) {
      await this.handleSendRequest();
    }
  });

  this.on('key:ctrl+s', () => {
    if (this.state.selectedRequest) {
      this.handleSaveRequest();
    }
  });

  // ... more handlers
}
```

---

## Performance Optimizations

### 1. Lazy Loading

- Collections loaded on demand
- Large responses truncated for display
- Pagination for long lists

### 2. Caching

- Response caching (optional)
- Environment variables cached
- Configuration cached in memory

### 3. Efficient Rendering

- OpenTUI's virtual DOM
- Minimal re-renders
- Debounced input fields

### 4. Resource Management

- Request timeouts
- Connection pooling (Axios)
- Cleanup on unmount

---

## Security Considerations

### 1. Credential Storage

```
Sensitive Data → Encrypted → Stored in ~/.termin-api/auth/
                  (keytar)
```

### 2. Environment Variables

- Never store secrets in collections
- Use {{variables}} for sensitive data
- Keep .env files in .gitignore

### 3. File Permissions

```bash
chmod 700 ~/.termin-api/       # Owner only
chmod 600 ~/.termin-api/auth/* # Owner read/write only
```

### 4. SSL/TLS

- Validate certificates by default
- Option to disable for testing
- Warning shown when disabled

---

## Testing Strategy

### Unit Tests

```typescript
// Service tests
describe("HttpService", () => {
  it("should process variables", () => {
    const service = new HttpService();
    const result = service.processVariables("{{base_url}}/users", {
      base_url: "https://api.com",
    });
    expect(result).toBe("https://api.com/users");
  });
});
```

### Integration Tests

```typescript
// Storage + HTTP integration
describe("Request Flow", () => {
  it("should save and load request", async () => {
    const storage = StorageService.getInstance();
    const request = createMockRequest();

    await storage.saveRequest(request);
    const loaded = await storage.loadRequest(request.id);

    expect(loaded).toEqual(request);
  });
});
```

### E2E Tests

- Full TUI interaction tests
- Keyboard navigation tests
- Request execution tests

---

## Deployment Architecture

### NPM Package Structure

```
termin-api/
├── dist/                  # Compiled JavaScript
│   ├── index.js          # Entry point
│   ├── App.js            # Main app
│   ├── components/       # UI components
│   ├── services/         # Business logic
│   └── types/            # Type definitions
├── package.json          # Package metadata
├── README.md             # Documentation
└── LICENSE               # MIT License
```

### Installation Flow

```
npm install -g termin-api
         ↓
Download from npm registry
         ↓
Extract to node_modules/
         ↓
Create symlink: termin-api → dist/index.js
         ↓
User can run: termin-api
```

---

## Future Enhancements

### Phase 2

- [ ] WebSocket support
- [ ] gRPC client
- [ ] Response visualization (charts)
- [ ] Advanced scripting (pre/post request)

### Phase 3

- [ ] Team collaboration (cloud sync)
- [ ] Real-time collaboration
- [ ] API documentation generation
- [ ] Load testing capabilities

### Phase 4

- [ ] AI-powered request suggestions
- [ ] Smart autocomplete
- [ ] Performance analysis
- [ ] Security scanning

---

## Technology Stack

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  OpenTUI + Chalk + Gradient String  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Business Logic Layer        │
│  TypeScript + Node.js Services      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│           Data Layer                │
│  File System (JSON) + Keytar        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       External Dependencies         │
│  Axios + Commander + Highlight.js   │
└─────────────────────────────────────┘
```

---

**This architecture provides a solid foundation for a professional-grade terminal API client!** 🚀
