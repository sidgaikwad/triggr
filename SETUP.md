# 🚀 Setup Guide - Termin API with OpenTUI

## Overview

This project is built using **OpenTUI** - a modern framework for building Terminal User Interfaces. Since OpenTUI is a relatively new framework, this guide will help you set it up properly.

---

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn** or **pnpm**
- A terminal that supports 256 colors (most modern terminals)

---

## Installation Steps

### Option 1: Using the Package (When Published)

```bash
# Install globally
npm install -g termin-api

# Run
termin-api
```

### Option 2: From Source (Development)

#### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/termin-api.git
cd termin-api
```

#### Step 2: Install OpenTUI

OpenTUI can be installed via npm:

```bash
npm install @opentui/core
```

If the package is not yet available on npm, you can install it from the GitHub repository:

```bash
npm install git+https://github.com/anomalyco/opentui.git
```

#### Step 3: Install Other Dependencies

```bash
npm install
```

This will install:

- `axios` - HTTP client
- `chalk` - Terminal styling
- `commander` - CLI framework
- `lowdb` - Local database
- `gradient-string` - Gradient text
- `highlight.js` - Syntax highlighting
- TypeScript and related tools

#### Step 4: Build the Project

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

#### Step 5: Run Development Mode

```bash
npm run dev
```

Or run the built version:

```bash
npm start
```

---

## OpenTUI Framework Overview

OpenTUI uses a **component-based architecture** similar to React, but optimized for terminal interfaces.

### Basic OpenTUI Concepts

#### 1. Components

Components are the building blocks of your TUI:

```typescript
import { Component, Box, Text } from '@opentui/core';

class MyComponent extends Component {
  render() {
    return (
      <Box>
        <Text color="cyan">Hello OpenTUI!</Text>
      </Box>
    );
  }
}
```

#### 2. Layout System

OpenTUI uses a flexbox-like layout:

```typescript
<Box direction="row" width="100%" height="100%">
  <Box width="30%">Sidebar</Box>
  <Box width="70%">Main Content</Box>
</Box>
```

#### 3. State Management

Components have state just like React:

```typescript
class Counter extends Component {
  state = { count: 0 };

  increment() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return <Text>Count: {this.state.count}</Text>;
  }
}
```

#### 4. Event Handling

OpenTUI provides keyboard and mouse event handling:

```typescript
componentDidMount() {
  this.on('key:enter', () => {
    this.handleSubmit();
  });

  this.on('key:ctrl+c', () => {
    process.exit(0);
  });
}
```

---

## Project Structure

```
termin-api/
├── src/
│   ├── App.tsx                    # Main application component
│   ├── components/                # UI components
│   │   ├── CollectionBrowser.tsx  # Collections sidebar
│   │   ├── RequestBuilder.tsx     # Request editor
│   │   ├── ResponseViewer.tsx     # Response display
│   │   ├── StatusBar.tsx          # Bottom status bar
│   │   ├── HelpModal.tsx          # Help overlay
│   │   └── EnvironmentSelector.tsx# Environment switcher
│   ├── services/                  # Business logic
│   │   ├── storage.ts             # File persistence
│   │   ├── http.ts                # HTTP requests
│   │   └── auth.ts                # Authentication
│   ├── types/                     # TypeScript definitions
│   │   └── index.ts
│   ├── utils/                     # Utilities
│   │   ├── formatter.ts           # JSON/XML formatting
│   │   └── validator.ts           # Input validation
│   └── index.tsx                  # Entry point & CLI
├── package.json
├── tsconfig.json
├── README.md
└── SETUP.md (this file)
```

---

## OpenTUI Components Used

### Core Components

1. **Box** - Layout container (like `<div>`)

   ```typescript
   <Box direction="column" border="single" padding={1}>
     Content
   </Box>
   ```

2. **Text** - Styled text display

   ```typescript
   <Text color="cyan" bold>Hello!</Text>
   ```

3. **Input** - Text input field

   ```typescript
   <Input
     value={this.state.url}
     onChange={(value) => this.setState({ url: value })}
     placeholder="Enter URL..."
   />
   ```

4. **List** - Scrollable list

   ```typescript
   <List
     items={this.state.items}
     onSelect={(item) => this.handleSelect(item)}
   />
   ```

5. **Panel** - Bordered container

   ```typescript
   <Panel title="Request Details" border="double">
     Content
   </Panel>
   ```

6. **Tabs** - Tab navigation
   ```typescript
   <Tabs
     tabs={['Params', 'Auth', 'Headers', 'Body']}
     activeTab={this.state.activeTab}
     onTabChange={(tab) => this.setState({ activeTab: tab })}
   />
   ```

---

## Troubleshooting

### OpenTUI not found

If you get an error about OpenTUI not being installed:

```bash
# Try installing from GitHub directly
npm install git+https://github.com/anomalyco/opentui.git

# Or check if it's published to npm
npm search opentui
```

### TypeScript errors

Make sure you have the correct TypeScript version:

```bash
npm install -D typescript@^5.3.0
```

### Terminal rendering issues

Ensure your terminal supports:

- 256 colors
- UTF-8 encoding
- ANSI escape codes

Test with:

```bash
echo -e "\033[38;5;82mGreen\033[0m"
```

### Build errors

Clean and rebuild:

```bash
rm -rf node_modules dist
npm install
npm run build
```

---

## Alternative: Using Ink Instead

If OpenTUI is not available or causing issues, the project can be adapted to use **Ink** (React for CLIs), which is more mature:

```bash
# Install Ink
npm install ink react

# The code structure is very similar, just import from 'ink' instead:
import { Box, Text } from 'ink';
```

Most of the component logic will remain the same!

---

## Development Workflow

### 1. Start Development Server

```bash
npm run dev
```

This uses `tsx` to run TypeScript directly without compilation.

### 2. Make Changes

Edit files in `src/` directory. The dev server may have hot reload (depends on OpenTUI support).

### 3. Build for Production

```bash
npm run build
```

### 4. Test the Built Version

```bash
node dist/index.js
```

### 5. Link Locally (for testing as global command)

```bash
npm link
termin-api  # Now works globally
```

---

## Publishing to npm

When ready to publish:

```bash
# Login to npm
npm login

# Publish
npm publish
```

---

## Environment Variables

Create a `.env` file for development:

```env
NODE_ENV=development
DEBUG=true
DEFAULT_TIMEOUT=30000
```

---

## Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly in your terminal
5. Submit a pull request

---

## Resources

- **OpenTUI Docs**: https://github.com/anomalyco/opentui
- **Ink (Alternative)**: https://github.com/vadimdemedes/ink
- **Chalk**: https://github.com/chalk/chalk
- **Commander**: https://github.com/tj/commander.js

---

## Support

For issues or questions:

- Open an issue on GitHub
- Check existing issues for solutions
- Join community discussions

---

## License

MIT

---

**Happy Coding! 🚀**
