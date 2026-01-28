# 🎨 Termin API - Components Documentation

## Overview

All UI components are built using **OpenTUI framework** and follow a React-like component architecture with props, state, and lifecycle methods.

---

## Component Hierarchy

```
App (Main Container)
├── CollectionBrowser (Left Sidebar)
│   └── Displays collections, folders, and requests in tree view
│
├── RequestBuilder (Center Panel)
│   ├── Method + URL input
│   ├── Tabs Component
│   │   ├── Params Tab
│   │   ├── Auth Tab
│   │   ├── Headers Tab
│   │   ├── Body Tab
│   │   └── Tests Tab
│   └── Action Buttons (Send, Save, Clear)
│
├── ResponseViewer (Bottom Panel)
│   ├── Response Header (Status, Time, Size)
│   ├── View Tabs (Body, Headers, Cookies)
│   └── Syntax Highlighted Content
│
├── StatusBar (Footer)
│   └── Shows current status and keyboard shortcuts
│
├── HelpModal (Overlay)
│   └── Keyboard shortcuts reference
│
└── EnvironmentSelector (Overlay)
    └── Environment management and variable display
```

---

## 📁 CollectionBrowser

**Location**: `src/components/CollectionBrowser.tsx`

### Purpose

Displays collections and their contents in a navigable tree structure on the left sidebar.

### Props

```typescript
interface Props {
  collections: Collection[];
  selectedCollection: string | null;
  onSelectCollection: (id: string) => void;
  onSelectRequest: (request: Request) => void;
  onCreateCollection?: (name: string) => void;
  onDeleteCollection?: (id: string) => void;
}
```

### State

```typescript
interface State {
  selectedIndex: number;
  expandedCollections: Set<string>;
  expandedFolders: Set<string>;
  searchQuery: string;
  showNewCollectionPrompt: boolean;
}
```

### Features

- ✅ Tree view with expand/collapse
- ✅ Keyboard navigation (↑/↓)
- ✅ Visual indicators (icons, colors)
- ✅ HTTP method color coding (GET=green, POST=blue, etc.)
- ✅ Request count per collection
- ✅ Quick actions (+, Delete, Search)

### Keyboard Shortcuts

- `↑/↓` - Navigate items
- `Enter` - Select item / Toggle expand
- `Space` - Toggle expand/collapse
- `+` - New collection
- `Delete` - Delete selected
- `/` - Search

### Key Methods

- `buildItemList()` - Flattens tree structure for display
- `renderItem()` - Renders individual collection/folder/request
- `toggleExpanded()` - Expand/collapse collections and folders
- `getIcon()` - Returns appropriate icon (📁/📂/📄)
- `getMethodColor()` - Returns color based on HTTP method

---

## 🔥 RequestBuilder

**Location**: `src/components/RequestBuilder.tsx`

### Purpose

Central panel for building and configuring HTTP requests with tabbed interface.

### Props

```typescript
interface Props {
  request: Request | null;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onRequestChange: (request: Request) => void;
  onSend: (request: Request) => void;
  onSave: (request: Request) => void;
  loading: boolean;
}
```

### State

```typescript
interface State {
  method: HttpMethod;
  url: string;
  params: Param[];
  headers: Header[];
  body: RequestBody | null;
  auth: Auth | null;
  selectedParamIndex: number;
  selectedHeaderIndex: number;
  focusedField: string;
}
```

### Features

- ✅ Method selector (GET, POST, PUT, etc.)
- ✅ URL input with variable support
- ✅ Five tabs: Params, Auth, Headers, Body, Tests
- ✅ Auth types: Bearer, Basic, API Key, OAuth2, JWT
- ✅ Body types: JSON, GraphQL, Raw, Form Data
- ✅ Add/remove params and headers
- ✅ Quick add common headers

### Keyboard Shortcuts

- `Ctrl+Enter` - Send request
- `Ctrl+S` - Save request
- `Ctrl+K` - Add param/header (context-aware)
- `Alt+1-5` - Switch between tabs

### Tabs

#### 1. Params Tab

- Query parameter key-value pairs
- Enable/disable individual params
- Support for `{{variables}}`

#### 2. Auth Tab

Supported auth types:

- **Bearer Token** - Simple token in Authorization header
- **Basic Auth** - Username + password (base64 encoded)
- **API Key** - Custom key in header or query
- **OAuth 2.0** - Client credentials flow
- **JWT** - JSON Web Token

#### 3. Headers Tab

- Custom HTTP headers
- Enable/disable headers
- Quick add buttons (JSON, Accept)

#### 4. Body Tab

Body types:

- **JSON** - Syntax validated JSON
- **GraphQL** - Query + Variables
- **Raw** - Plain text
- **Form Data** - Multipart form data
- **URL Encoded** - x-www-form-urlencoded

#### 5. Tests Tab

- JavaScript test scripts (coming soon)
- Response validation

### Key Methods

- `getCurrentRequest()` - Builds Request object from state
- `handleSend()` - Validates and sends request
- `handleSave()` - Saves request to collection
- `renderParamsTab()` - Renders params editor
- `renderAuthTab()` - Renders auth configuration
- `renderHeadersTab()` - Renders headers editor
- `renderBodyTab()` - Renders body editor with type selector

---

## 💬 ResponseViewer

**Location**: `src/components/ResponseViewer.tsx`

### Purpose

Displays API responses with syntax highlighting, status codes, and metadata.

### Props

```typescript
interface Props {
  response: Response | null;
  loading: boolean;
}
```

### State

```typescript
interface State {
  view: "body" | "headers" | "cookies";
  prettyPrint: boolean;
  collapsedSections: Set<string>;
}
```

### Features

- ✅ Color-coded status codes (green=2xx, yellow=3xx, red=4xx/5xx)
- ✅ Response time and size display
- ✅ Syntax highlighting for JSON
- ✅ Three view modes: Body, Headers, Cookies
- ✅ Pretty print toggle
- ✅ Loading animation
- ✅ Error state with details

### Views

#### Body View

- JSON syntax highlighting
- Object/array expansion
- Pretty print formatting
- Color coding: strings (green), numbers (magenta), booleans (yellow), null (gray)

#### Headers View

- Table of response headers
- Key-value display
- Header count

#### Cookies View

- Parsed Set-Cookie headers
- Cookie attributes display

### Keyboard Shortcuts

- `1` - Switch to Body view
- `2` - Switch to Headers view
- `3` - Switch to Cookies view
- `P` - Toggle pretty print

### Status Colors

- `200-299` (Success) → Green with ✓
- `300-399` (Redirect) → Yellow with ↪
- `400-499` (Client Error) → Red with ⚠
- `500-599` (Server Error) → Magenta with ✗

### Key Methods

- `renderLoading()` - Animated loading state
- `renderEmpty()` - Empty state when no response
- `renderBody()` - Syntax highlighted body
- `renderHeaders()` - Headers table
- `renderCookies()` - Cookie list
- `renderError()` - Error state with details
- `highlightJSON()` - Recursive JSON syntax highlighter
- `getStatusColor()` - Returns color based on status code

---

## 📊 StatusBar

**Location**: `src/components/StatusBar.tsx`

### Purpose

Bottom status bar showing current status message and keyboard shortcuts.

### Props

```typescript
interface Props {
  message: string;
}
```

### Features

- ✅ Current status message
- ✅ Quick reference keyboard shortcuts
- ✅ Always visible at bottom

### Display

```
● [Status Message]  |  Ctrl+C Exit | F1 Help | F2 Env | Ctrl+Enter Send
```

---

## ❓ HelpModal

**Location**: `src/components/HelpModal.tsx`

### Purpose

Modal overlay showing comprehensive keyboard shortcuts and tips.

### Props

```typescript
interface Props {
  onClose: () => void;
}
```

### Features

- ✅ Two-column layout
- ✅ Categorized shortcuts
- ✅ Tips section
- ✅ Close on Esc or F1

### Shortcut Categories

1. **Global Shortcuts** - App-wide controls
2. **Navigation** - Moving around the UI
3. **Request Builder** - Tab shortcuts
4. **Collections** - Collection management
5. **Response Viewer** - View switching

### Key Methods

- `componentDidMount()` - Registers Esc/F1 handlers

---

## 🌍 EnvironmentSelector

**Location**: `src/components/EnvironmentSelector.tsx`

### Purpose

Modal for selecting active environment and viewing variables.

### Props

```typescript
interface Props {
  environments: Environment[];
  activeEnv: string;
  onSelect: (envId: string) => void;
  onClose: () => void;
}
```

### State

```typescript
interface State {
  selectedIndex: number;
  showVariables: boolean;
}
```

### Features

- ✅ List of available environments
- ✅ "None" option for no environment
- ✅ Active environment indicator (●)
- ✅ Variable count per environment
- ✅ Variables viewer (key-value table)
- ✅ Keyboard navigation

### Layout

```
┌─────────────────────────────────┐
│ Environments    │  Variables    │
│ ○ None          │  base_url     │
│ ● Development   │  api_key      │
│ ○ Staging       │  ...          │
│ ○ Production    │               │
└─────────────────────────────────┘
```

### Keyboard Shortcuts

- `↑/↓` - Navigate environments
- `Enter` - Select environment
- `V` - Toggle variables view
- `Esc/F2` - Close

### Key Methods

- `renderEnvironmentItem()` - Renders env list item
- `renderVariables()` - Displays variable table

---

## Component Communication

### Data Flow

```
App (State Container)
 │
 ├─► CollectionBrowser
 │    └─ onSelectRequest() ──► App.handleSelectRequest()
 │
 ├─► RequestBuilder
 │    ├─ onSend() ──► App.handleSendRequest()
 │    └─ onSave() ──► App.handleSaveRequest()
 │
 └─► ResponseViewer
      └─ Receives response from App state
```

### Event Flow

```
User Action (Keyboard/Click)
       ↓
Component Handler
       ↓
Callback to Parent (App)
       ↓
App State Update
       ↓
Props Update to Children
       ↓
Component Re-render
```

---

## Styling with OpenTUI

### Common Props

```typescript
// Box (Layout)
<Box
  direction="row" | "column"
  width="50%" | 20
  height="100%" | 10
  padding={1}
  margin={1}
  border="single" | "double"
  borderColor="cyan"
  backgroundColor="blue"
  alignItems="center"
  justifyContent="flex-start"
  flexGrow={1}
  overflow="scroll"
/>

// Text (Content)
<Text
  color="cyan"
  backgroundColor="blue"
  bold
  dimColor
  fontSize={10}
/>

// Input (User Input)
<Input
  value={text}
  onChange={(val) => setText(val)}
  placeholder="Enter text..."
  multiline
  rows={5}
  disabled
  type="password"
/>
```

### Color Palette

- `cyan` - Primary highlights, headers
- `green` - Success, GET requests
- `blue` - POST requests, selected items
- `yellow` - Warnings, PUT/PATCH requests
- `red` - Errors, DELETE requests
- `magenta` - Numbers, server errors
- `gray` - Borders, disabled items
- `dimColor` - Secondary text

---

## Best Practices

### 1. Component Structure

```typescript
export class MyComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      /* initial state */
    };
  }

  componentDidMount() {
    // Setup keyboard listeners
    this.on("key:enter", () => this.handleAction());
  }

  // Event handlers
  handleAction() {
    /* ... */
  }

  // Render helpers
  renderSection() {
    /* ... */
  }

  // Main render
  render() {
    /* ... */
  }
}
```

### 2. Keyboard Event Handling

```typescript
this.on("key:enter", handler); // Enter key
this.on("key:ctrl+s", handler); // Ctrl+S
this.on("key:up", handler); // Arrow up
this.on("key:f1", handler); // Function key
```

### 3. State Updates

```typescript
// Always use setState
this.setState({ count: this.state.count + 1 });

// Notify parent of changes
this.props.onRequestChange(this.getCurrentRequest());
```

### 4. Props Validation

```typescript
// Use TypeScript interfaces for props
interface Props {
  required: string;
  optional?: number;
  callback: (data: any) => void;
}
```

---

## Testing Components

### Unit Tests

```typescript
describe("CollectionBrowser", () => {
  it("should render collections", () => {
    const collections = [mockCollection];
    const component = new CollectionBrowser({ collections });
    expect(component.buildItemList()).toHaveLength(1);
  });
});
```

### Integration Tests

```typescript
describe("RequestBuilder", () => {
  it("should call onSend when Ctrl+Enter pressed", () => {
    const onSend = jest.fn();
    const component = new RequestBuilder({ onSend });
    component.emit("key:ctrl+enter");
    expect(onSend).toHaveBeenCalled();
  });
});
```

---

## Performance Tips

1. **Avoid Re-renders**: Only update state when necessary
2. **Lazy Loading**: Load large lists on demand
3. **Debounce Input**: Debounce rapid input changes
4. **Memoization**: Cache expensive computations
5. **Virtual Scrolling**: For very long lists

---

## Future Enhancements

- [ ] Component animations (slide, fade)
- [ ] Drag-and-drop in collections
- [ ] Resizable panels
- [ ] Theme customization
- [ ] Plugin system for custom components

---

**All components are now complete and ready to use!** 🎉
