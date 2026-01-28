/**
 * Main App Component - OpenTUI Architecture
 *
 * OpenTUI uses a declarative component model similar to React
 * Components are defined with render() methods and state management
 */

import { Component, Box, Text, Input, List, Panel, Tabs } from "@opentui/core";
import { CollectionBrowser } from "./components/CollectionBrowser";
import { RequestBuilder } from "./components/RequestBuilder";
import { ResponseViewer } from "./components/ResponseViewer";
import { StatusBar } from "./components/StatusBar";
import { StorageService } from "./services/storage";
import { HttpService } from "./services/http";
import type { Collection, Request, Response as ApiResponse } from "./types";

interface AppState {
  collections: Collection[];
  selectedCollection: string | null;
  selectedRequest: Request | null;
  response: ApiResponse | null;
  loading: boolean;
  activeView: "main" | "help" | "environments";
  statusMessage: string;
  activeTab: "params" | "auth" | "headers" | "body" | "tests";
}

export class App extends Component<{}, AppState> {
  private storage: StorageService;
  private httpService: HttpService;

  constructor(props: {}) {
    super(props);

    this.storage = StorageService.getInstance();
    this.httpService = new HttpService();

    // Initialize state
    this.state = {
      collections: this.storage.loadCollections(),
      selectedCollection: null,
      selectedRequest: null,
      response: null,
      loading: false,
      activeView: "main",
      statusMessage: "Ready - Press F1 for help",
      activeTab: "params",
    };

    // Set initial selected collection
    if (this.state.collections.length > 0) {
      this.state.selectedCollection = this.state.collections[0].id;
    }
  }

  componentDidMount() {
    // Setup keyboard shortcuts
    this.setupKeyboardShortcuts();
  }

  setupKeyboardShortcuts() {
    this.on("key:ctrl+c", () => {
      process.exit(0);
    });

    this.on("key:f1", () => {
      this.setState({
        activeView: this.state.activeView === "help" ? "main" : "help",
      });
    });

    this.on("key:ctrl+enter", async () => {
      if (this.state.selectedRequest) {
        await this.handleSendRequest(this.state.selectedRequest);
      }
    });

    this.on("key:ctrl+s", () => {
      if (this.state.selectedRequest) {
        this.handleSaveRequest(this.state.selectedRequest);
      }
    });

    this.on("key:ctrl+n", () => {
      this.handleNewRequest();
    });

    // Tab switching
    this.on("key:alt+1", () => this.setState({ activeTab: "params" }));
    this.on("key:alt+2", () => this.setState({ activeTab: "auth" }));
    this.on("key:alt+3", () => this.setState({ activeTab: "headers" }));
    this.on("key:alt+4", () => this.setState({ activeTab: "body" }));
    this.on("key:alt+5", () => this.setState({ activeTab: "tests" }));
  }

  async handleSendRequest(request: Request) {
    this.setState({
      loading: true,
      statusMessage: "⚡ Sending request...",
      response: null,
    });

    try {
      const startTime = Date.now();
      const result = await this.httpService.sendRequest(request);
      const duration = Date.now() - startTime;

      this.setState({
        response: { ...result, time: duration },
        loading: false,
        statusMessage: `✓ Request completed in ${duration}ms`,
      });
    } catch (error: any) {
      this.setState({
        response: {
          status: 0,
          statusText: "Error",
          headers: {},
          data: { error: error.message },
          time: 0,
          size: 0,
        },
        loading: false,
        statusMessage: `✗ Request failed: ${error.message}`,
      });
    }
  }

  handleSaveRequest(request: Request) {
    if (this.state.selectedCollection) {
      const collection = this.state.collections.find(
        (c) => c.id === this.state.selectedCollection,
      );

      if (collection) {
        const existingIndex = collection.requests.findIndex(
          (r) => r.id === request.id,
        );

        if (existingIndex >= 0) {
          collection.requests[existingIndex] = {
            ...request,
            updatedAt: new Date().toISOString(),
          };
        } else {
          collection.requests.push(request);
        }

        this.storage.saveCollection(collection);
        this.setState({
          collections: [...this.state.collections],
          statusMessage: `✓ Saved: ${request.name}`,
        });
      }
    }
  }

  handleNewRequest() {
    const newRequest: Request = {
      id: `req_${Date.now()}`,
      name: "New Request",
      method: "GET",
      url: "",
      headers: [],
      params: [],
      body: null,
      auth: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.setState({
      selectedRequest: newRequest,
      statusMessage: "New request created - Press Ctrl+S to save",
    });
  }

  handleSelectRequest(request: Request) {
    this.setState({
      selectedRequest: request,
      response: null,
      statusMessage: `Loaded: ${request.name}`,
    });
  }

  handleSelectCollection(collectionId: string) {
    this.setState({
      selectedCollection: collectionId,
      statusMessage: `Selected collection`,
    });
  }

  render() {
    const {
      collections,
      selectedCollection,
      selectedRequest,
      response,
      loading,
      statusMessage,
      activeTab,
    } = this.state;

    return (
      <Box direction="column" width="100%" height="100%">
        {/* Header */}
        <Box border="double" borderColor="cyan" padding={1}>
          <Text bold color="cyan">
            ⚡ TERMIN API
          </Text>
          <Text color="gray"> - Terminal API Client</Text>
          <Box flex={1} />
          <Text color="gray">Collections: {collections.length}</Text>
        </Box>

        {/* Main Content Area */}
        <Box direction="row" flex={1}>
          {/* Left Sidebar - Collections Browser */}
          <Box
            width="25%"
            border="single"
            borderColor="gray"
            direction="column"
          >
            <CollectionBrowser
              collections={collections}
              selectedCollection={selectedCollection}
              onSelectCollection={(id) => this.handleSelectCollection(id)}
              onSelectRequest={(req) => this.handleSelectRequest(req)}
            />
          </Box>

          {/* Center - Request Builder */}
          <Box width="75%" direction="column">
            {/* Request Builder Panel */}
            <Box flex={2} border="single" borderColor="gray" direction="column">
              <RequestBuilder
                request={selectedRequest}
                activeTab={activeTab}
                onTabChange={(tab) => this.setState({ activeTab: tab })}
                onRequestChange={(req) =>
                  this.setState({ selectedRequest: req })
                }
                onSend={(req) => this.handleSendRequest(req)}
                onSave={(req) => this.handleSaveRequest(req)}
                loading={loading}
              />
            </Box>

            {/* Response Viewer Panel */}
            <Box flex={1} border="single" borderColor="gray" direction="column">
              <ResponseViewer response={response} loading={loading} />
            </Box>
          </Box>
        </Box>

        {/* Status Bar */}
        <StatusBar message={statusMessage} />
      </Box>
    );
  }
}

export default App;
