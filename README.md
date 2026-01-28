# 🚀 Termin API - Terminal API Client

<div align="center">

**A modern, beautiful API testing tool for your terminal - Like Postman, but built for the command line using OpenTUI**

[![npm version](https://img.shields.io/npm/v/termin-api.svg)](https://www.npmjs.com/package/termin-api)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![Termin API Demo](https://via.placeholder.com/800x400?text=Termin+API+Screenshot)

</div>

---

## ✨ Features

- 🎨 **Beautiful TUI** - Built with OpenTUI for modern terminal interfaces
- 💾 **Persistent Storage** - Collections saved to `~/.termin-api/` (survives restarts!)
- 🌐 **Multiple Protocols** - REST, GraphQL, WebSocket support
- 🔐 **Authentication** - Bearer, Basic, API Key, OAuth 2.0, JWT
- 📁 **Collections** - Organize requests in folders and collections
- 🎯 **Environments** - Switch between Dev, Staging, Production
- 🔄 **Variables** - Use `{{variables}}` in URLs, headers, body
- 📊 **Response Viewer** - Syntax-highlighted, formatted responses
- ⚡ **Fast** - Keyboard-driven workflow, no mouse needed
- 📦 **Portable** - Import/export Postman collections
- 🎬 **Animated** - Beautiful loading states and transitions

---

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g termin-api
```

### Using npx (No Installation)

```bash
npx termin-api
```

### From Source (Development)

```bash
git clone https://github.com/yourusername/termin-api.git
cd termin-api
npm install
npm run dev
```

---

## 🚀 Quick Start

### Launch the TUI

```bash
# Start interactive interface
termin-api

# Or use short alias
termin
```

### First Request (Quick Mode)

```bash
# You'll see the welcome screen
# Press 'n' for new request
# Enter URL: https://jsonplaceholder.typicode.com/posts
# Press Ctrl+Enter to send
# View beautiful response!
```

---

## 🎮 Usage

### Basic Commands

```bash
termin-api                    # Launch interactive TUI
termin-api run <request-id>   # Run saved request from CLI
termin-api list               # List all collections
termin-api import <file>      # Import Postman collection
termin-api export <name>      # Export collection to file
termin-api clear-history      # Clear request history
```

### Example Workflow

```bash
# 1. Start termin-api
$ termin-api

# 2. Create a new collection (Press '+' in Collections panel)
#    Name it "My API"

# 3. Create a new request (Ctrl+N)
#    URL: https://api.github.com/users/octocat
#    Method: GET

# 4. Send request (Ctrl+Enter)
#    See beautiful JSON response!

# 5. Save request (Ctrl+S)
#    Name it "Get GitHub User"

# 6. Request is now saved to ~/.termin-api/collections/
#    Will be there next time you open termin-api!
```

---

## ⌨️ Keyboard Shortcuts

### Global

| Shortcut     | Action               |
| ------------ | -------------------- |
| `Ctrl+C`     | Quit application     |
| `Ctrl+N`     | New request          |
| `Ctrl+S`     | Save current request |
| `Ctrl+Enter` | Send request         |
| `F1`         | Help menu            |
| `F2`         | Switch environment   |
| `Esc`        | Cancel/Back          |

### Navigation

| Shortcut    | Action         |
| ----------- | -------------- |
| `Tab`       | Next field     |
| `Shift+Tab` | Previous field |
| `↑/↓`       | Navigate lists |
| `Enter`     | Select item    |

### Request Builder

| Shortcut | Action               |
| -------- | -------------------- |
| `Alt+1`  | Params tab           |
| `Alt+2`  | Auth tab             |
| `Alt+3`  | Headers tab          |
| `Alt+4`  | Body tab             |
| `Alt+5`  | Tests tab            |
| `Ctrl+K` | Add new param/header |

---

## 🎨 Interface Overview

```
╔══════════════════════════════════════════════════════════════════════════╗
║  TERMIN API  ⚡                                                           ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║  📁 Collections         │  🔥 Request Builder                           ║
║  ┌──────────────┐       │  ┌─────────────────────────────────────┐     ║
║  │ ► My API     │       │  │ GET https://api.example.com/users   │     ║
║  │   ├─ Users   │       │  └─────────────────────────────────────┘     ║
║  │   └─ Posts   │       │                                              ║
║  │ ► GraphQL    │       │  [Params] Auth Headers Body Tests            ║
║  └──────────────┘       │  ┌─────────────────────────────────────┐     ║
║                         │  │ page: 1                              │     ║
║                         │  │ limit: 10                            │     ║
║                         │  └─────────────────────────────────────┘     ║
║                         │  [Send] [Save] [Clear]                       ║
╠══════════════════════════════════════════════════════════════════════════╣
║  💬 Response (200 OK - 145ms)                                            ║
║  { "status": "success", "data": [...] }                                  ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## 📂 Data Storage

### Where is my data stored?

All data is stored in: `~/.termin-api/`

```
~/.termin-api/
├── config.json              # Global settings
├── collections/             # Your collections
│   ├── my-api.json
│   └── graphql-tests.json
├── environments/            # Environment variables
│   ├── dev.json
│   ├── staging.json
│   └── production.json
└── history.json            # Request history
```

### Benefits

✅ **Persistent** - Data survives terminal restarts  
✅ **Version Control** - Commit collections to git  
✅ **Portable** - Copy between machines  
✅ **Shareable** - Share collections with your team  
✅ **Backup-friendly** - Simple JSON files

---

## 🌐 Supported Request Types

### 1. REST API

```json
{
  "method": "POST",
  "url": "https://api.example.com/users",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer {{token}}"
  },
  "body": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Supported Methods**: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS

### 2. GraphQL

```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
  }
}

# Variables
{
  "id": "123"
}
```

### 3. WebSocket (Coming Soon)

```javascript
// Connect to WebSocket
ws://api.example.com/socket

// Send messages
{"type": "subscribe", "channel": "updates"}
```

---

## 🔐 Authentication

### Bearer Token

```json
{
  "type": "bearer",
  "token": "your_token_here"
}
```

### Basic Auth

```json
{
  "type": "basic",
  "username": "admin",
  "password": "secret"
}
```

### API Key

```json
{
  "type": "apikey",
  "key": "X-API-Key",
  "value": "your_api_key",
  "addTo": "header"
}
```

### OAuth 2.0

```json
{
  "type": "oauth2",
  "grantType": "client_credentials",
  "clientId": "your_client_id",
  "clientSecret": "your_secret",
  "accessTokenUrl": "https://api.example.com/oauth/token"
}
```

---

## 🎯 Environment Variables

Create environments for different stages:

```json
// ~/.termin-api/environments/dev.json
{
  "id": "env_dev",
  "name": "Development",
  "variables": {
    "base_url": "http://localhost:3000",
    "api_key": "dev_key_123"
  }
}

// Use in requests
{
  "url": "{{base_url}}/api/users",
  "headers": {
    "X-API-Key": "{{api_key}}"
  }
}
```

Switch environments with `F2` or `Ctrl+E`

---

## 📥 Import/Export

### Import Postman Collection

```bash
termin-api import my-collection.json
```

### Export Collection

```bash
termin-api export my-api > my-api-backup.json
```

---

## 🎬 Examples

### Example 1: Testing REST API

```bash
# Start termin-api
$ termin-api

# Create new request (Ctrl+N)
Method: GET
URL: https://jsonplaceholder.typicode.com/posts/1

# Add header (Navigate to Headers tab)
Content-Type: application/json

# Send request (Ctrl+Enter)
# Response:
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere...",
  "body": "quia et suscipit..."
}

# Save request (Ctrl+S)
Name: Get Single Post
```

### Example 2: GraphQL Query

```bash
# New request
Method: POST
URL: https://api.spacex.land/graphql

# Navigate to Body tab → GraphQL
Query:
query {
  launchesPast(limit: 5) {
    mission_name
    launch_date_local
    rocket {
      rocket_name
    }
  }
}

# Send request (Ctrl+Enter)
# Beautiful GraphQL response!
```

### Example 3: Environment Variables

```bash
# Create environment (F2 → New Environment)
Name: Production
Variables:
  base_url = https://api.prod.example.com
  auth_token = prod_token_xyz

# In your request:
URL: {{base_url}}/api/users
Headers:
  Authorization: Bearer {{auth_token}}

# Switch between Dev/Prod with F2!
```

---

## 🏗️ Architecture

### Built With

- **[OpenTUI](https://github.com/anomalyco/opentui)** - Modern TUI framework
- **Axios** - HTTP client
- **TypeScript** - Type safety
- **Chalk** - Terminal colors
- **Highlight.js** - Syntax highlighting

### Project Structure

```
termin-api/
├── src/
│   ├── App.tsx                 # Main application
│   ├── components/             # UI components
│   │   ├── CollectionBrowser.tsx
│   │   ├── RequestBuilder.tsx
│   │   ├── ResponseViewer.tsx
│   │   └── StatusBar.tsx
│   ├── services/               # Business logic
│   │   ├── storage.ts          # File persistence
│   │   ├── http.ts             # HTTP client
│   │   └── auth.ts             # Authentication
│   ├── types/                  # TypeScript types
│   └── index.tsx              # Entry point
├── package.json
└── README.md
```

---

## 🔧 Configuration

Edit `~/.termin-api/config.json`:

```json
{
  "theme": "dark",
  "defaultTimeout": 30000,
  "followRedirects": true,
  "validateSSL": true,
  "maxHistorySize": 100
}
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 Roadmap

- [x] Basic REST API support
- [x] Collections and folders
- [x] Environment variables
- [x] Authentication (Bearer, Basic, API Key)
- [x] GraphQL support
- [ ] WebSocket support
- [ ] gRPC support
- [ ] Response visualization (charts)
- [ ] Team collaboration (cloud sync)
- [ ] Load testing capabilities
- [ ] AI-powered request suggestions

---

## 🐛 Troubleshooting

### Collections not saving?

Check permissions on `~/.termin-api/` directory:

```bash
chmod 755 ~/.termin-api
```

### SSL Certificate errors?

Disable SSL validation in config:

```json
{
  "validateSSL": false
}
```

### Request timeout?

Increase timeout in config:

```json
{
  "defaultTimeout": 60000
}
```

---

## 📄 License

MIT © Termin API

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/termin-api&type=Date)](https://star-history.com/#yourusername/termin-api&Date)

---

## 📧 Contact

- GitHub: [@yourusername](https://github.com/yourusername)
- Issues: [GitHub Issues](https://github.com/yourusername/termin-api/issues)

---

<div align="center">

**Made with ❤️ for developers who love the terminal**

[⬆ Back to Top](#-termin-api---terminal-api-client)

</div>
