/**
 * ResponseViewer Component - OpenTUI
 *
 * Displays API response with syntax highlighting, status codes,
 * headers, and response metadata
 */

import { Component, Box, Text } from "@opentui/core";
import type { Response } from "../types/index";

interface Props {
  response: Response | null;
  loading: boolean;
}

interface State {
  view: "body" | "headers" | "cookies";
  prettyPrint: boolean;
  collapsedSections: Set<string>;
}

export class ResponseViewer extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      view: "body",
      prettyPrint: true,
      collapsedSections: new Set(),
    };
  }

  componentDidMount() {
    // Keyboard shortcuts
    this.on("key:1", () => this.setState({ view: "body" }));
    this.on("key:2", () => this.setState({ view: "headers" }));
    this.on("key:3", () => this.setState({ view: "cookies" }));
    this.on("key:p", () => this.togglePrettyPrint());
  }

  /**
   * Toggle pretty print
   */
  togglePrettyPrint() {
    this.setState({ prettyPrint: !this.state.prettyPrint });
  }

  /**
   * Get status color based on status code
   */
  getStatusColor(status: number): string {
    if (status >= 200 && status < 300) return "green";
    if (status >= 300 && status < 400) return "yellow";
    if (status >= 400 && status < 500) return "red";
    if (status >= 500) return "magenta";
    return "white";
  }

  /**
   * Get status emoji
   */
  getStatusEmoji(status: number): string {
    if (status >= 200 && status < 300) return "✓";
    if (status >= 300 && status < 400) return "↪";
    if (status >= 400 && status < 500) return "⚠";
    if (status >= 500) return "✗";
    return "•";
  }

  /**
   * Format file size
   */
  formatSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  /**
   * Syntax highlight JSON
   */
  highlightJSON(obj: any, indent: number = 0): JSX.Element[] {
    const elements: JSX.Element[] = [];
    const indentStr = "  ".repeat(indent);

    if (typeof obj === "object" && obj !== null) {
      if (Array.isArray(obj)) {
        elements.push(<Text key="array-start">[</Text>);
        obj.forEach((item, index) => {
          elements.push(
            <Text key={`array-${index}`}>
              {"\n"}
              {indentStr} {this.highlightJSON(item, indent + 1)}
              {index < obj.length - 1 ? "," : ""}
            </Text>,
          );
        });
        elements.push(
          <Text key="array-end">
            {"\n"}
            {indentStr}]
          </Text>,
        );
      } else {
        elements.push(<Text key="obj-start">{"{"}</Text>);
        const keys = Object.keys(obj);
        keys.forEach((key, index) => {
          elements.push(
            <Box key={`obj-${key}`} direction="column">
              <Text>
                {"\n"}
                {indentStr}
                <Text color="cyan">"{key}"</Text>:{" "}
                {this.highlightValue(obj[key], indent + 1)}
                {index < keys.length - 1 ? "," : ""}
              </Text>
            </Box>,
          );
        });
        elements.push(
          <Text key="obj-end">
            {"\n"}
            {indentStr}
            {"}"}
          </Text>,
        );
      }
    } else {
      elements.push(this.highlightValue(obj, indent));
    }

    return elements;
  }

  /**
   * Highlight primitive values
   */
  highlightValue(value: any, indent: number): JSX.Element {
    if (value === null) {
      return <Text color="gray">null</Text>;
    }
    if (typeof value === "boolean") {
      return <Text color="yellow">{String(value)}</Text>;
    }
    if (typeof value === "number") {
      return <Text color="magenta">{value}</Text>;
    }
    if (typeof value === "string") {
      return <Text color="green">"{value}"</Text>;
    }
    if (typeof value === "object") {
      return <Box>{this.highlightJSON(value, indent)}</Box>;
    }
    return <Text>{String(value)}</Text>;
  }

  /**
   * Render loading state
   */
  renderLoading() {
    return (
      <Box
        direction="column"
        padding={2}
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Text color="cyan" bold>
          ⚡ Sending Request...
        </Text>
        <Text dimColor marginTop={1}>
          Please wait...
        </Text>

        {/* Animated loading bar */}
        <Box marginTop={2} width={40}>
          <Text color="cyan">
            {"█".repeat(10)}
            {"░".repeat(10)}
          </Text>
        </Box>

        <Box marginTop={2}>
          <Text dimColor fontSize={10}>
            🌐 Connecting to server...
          </Text>
        </Box>
      </Box>
    );
  }

  /**
   * Render empty state
   */
  renderEmpty() {
    return (
      <Box
        direction="column"
        padding={2}
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Text dimColor>No response yet</Text>
        <Text dimColor fontSize={10} marginTop={1}>
          Press Ctrl+Enter to send request
        </Text>
      </Box>
    );
  }

  /**
   * Render response header with metadata
   */
  renderResponseHeader() {
    const { response } = this.props;
    if (!response) return null;

    const statusColor = this.getStatusColor(response.status);
    const statusEmoji = this.getStatusEmoji(response.status);

    return (
      <Box padding={1} borderBottom borderColor="gray">
        <Box>
          <Text color={statusColor} bold>
            {statusEmoji} {response.status} {response.statusText}
          </Text>
        </Box>

        <Box flexGrow={1} />

        <Box>
          <Text dimColor>⏱️ {response.time}ms</Text>
          <Text dimColor marginLeft={2}>
            📦 {this.formatSize(response.size)}
          </Text>
        </Box>
      </Box>
    );
  }

  /**
   * Render view tabs (Body, Headers, Cookies)
   */
  renderViewTabs() {
    const { view } = this.state;

    return (
      <Box borderBottom borderColor="gray">
        <Box
          padding={1}
          backgroundColor={view === "body" ? "blue" : undefined}
          onClick={() => this.setState({ view: "body" })}
        >
          <Text bold={view === "body"}>Body</Text>
        </Box>

        <Box
          padding={1}
          backgroundColor={view === "headers" ? "blue" : undefined}
          onClick={() => this.setState({ view: "headers" })}
        >
          <Text bold={view === "headers"}>Headers</Text>
        </Box>

        <Box
          padding={1}
          backgroundColor={view === "cookies" ? "blue" : undefined}
          onClick={() => this.setState({ view: "cookies" })}
        >
          <Text bold={view === "cookies"}>Cookies</Text>
        </Box>

        <Box flexGrow={1} />

        <Box padding={1}>
          <Text dimColor fontSize={10}>
            1 Body | 2 Headers | 3 Cookies | P Pretty
          </Text>
        </Box>
      </Box>
    );
  }

  /**
   * Render response body
   */
  renderBody() {
    const { response } = this.props;
    const { prettyPrint } = this.state;

    if (!response) return null;

    const { data } = response;

    // Handle different data types
    if (typeof data === "string") {
      return (
        <Box padding={2}>
          <Text>{data}</Text>
        </Box>
      );
    }

    if (typeof data === "object" && data !== null) {
      if (prettyPrint) {
        return (
          <Box direction="column" padding={2} overflow="scroll">
            {this.highlightJSON(data)}
          </Box>
        );
      } else {
        return (
          <Box padding={2} overflow="scroll">
            <Text>{JSON.stringify(data)}</Text>
          </Box>
        );
      }
    }

    return (
      <Box padding={2}>
        <Text>{String(data)}</Text>
      </Box>
    );
  }

  /**
   * Render response headers
   */
  renderHeaders() {
    const { response } = this.props;
    if (!response) return null;

    const headers = response.headers;
    const headerEntries = Object.entries(headers);

    if (headerEntries.length === 0) {
      return (
        <Box padding={2}>
          <Text dimColor>No headers</Text>
        </Box>
      );
    }

    return (
      <Box direction="column" padding={1} overflow="scroll">
        <Box borderBottom borderColor="gray" padding={1}>
          <Box width="40%">
            <Text bold>Name</Text>
          </Box>
          <Box width="60%">
            <Text bold>Value</Text>
          </Box>
        </Box>

        {headerEntries.map(([key, value], index) => (
          <Box key={index} borderBottom borderColor="gray" padding={1}>
            <Box width="40%">
              <Text color="cyan">{key}</Text>
            </Box>
            <Box width="60%">
              <Text>{value}</Text>
            </Box>
          </Box>
        ))}

        <Box marginTop={1} padding={1}>
          <Text dimColor fontSize={10}>
            Total: {headerEntries.length} headers
          </Text>
        </Box>
      </Box>
    );
  }

  /**
   * Render cookies
   */
  renderCookies() {
    const { response } = this.props;
    if (!response) return null;

    // Extract cookies from Set-Cookie header
    const setCookieHeader =
      response.headers["set-cookie"] || response.headers["Set-Cookie"];

    if (!setCookieHeader) {
      return (
        <Box padding={2}>
          <Text dimColor>No cookies in response</Text>
        </Box>
      );
    }

    // Parse cookies (simplified)
    const cookies = Array.isArray(setCookieHeader)
      ? setCookieHeader
      : [setCookieHeader];

    return (
      <Box direction="column" padding={1} overflow="scroll">
        <Box borderBottom borderColor="gray" padding={1}>
          <Text bold>Cookies ({cookies.length})</Text>
        </Box>

        {cookies.map((cookie, index) => {
          const [nameValue, ...attributes] = cookie.split(";");
          const [name, value] = nameValue.split("=");

          return (
            <Box
              key={index}
              direction="column"
              borderBottom
              borderColor="gray"
              padding={1}
            >
              <Box>
                <Text color="cyan" bold>
                  {name?.trim()}
                </Text>
                <Text> = </Text>
                <Text>{value?.trim()}</Text>
              </Box>
              {attributes.length > 0 && (
                <Box marginTop={1}>
                  <Text dimColor fontSize={10}>
                    {attributes.map((a) => a.trim()).join("; ")}
                  </Text>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    );
  }

  /**
   * Render error state
   */
  renderError() {
    const { response } = this.props;
    if (!response) return null;

    return (
      <Box direction="column" padding={2}>
        <Box marginBottom={2}>
          <Text color="red" bold>
            ⚠️ Request Failed
          </Text>
        </Box>

        <Box direction="column" padding={1} borderColor="red" border>
          <Text color="red">
            Status: {response.status} {response.statusText}
          </Text>

          {response.data && (
            <Box marginTop={2}>
              <Text>Error Details:</Text>
              <Box marginTop={1}>
                <Text dimColor>
                  {typeof response.data === "object"
                    ? JSON.stringify(response.data, null, 2)
                    : String(response.data)}
                </Text>
              </Box>
            </Box>
          )}
        </Box>

        <Box marginTop={2}>
          <Text dimColor fontSize={10}>
            💡 Tip: Check your URL, headers, and authentication
          </Text>
        </Box>
      </Box>
    );
  }

  /**
   * Render success animation
   */
  renderSuccessAnimation() {
    const { response } = this.props;
    if (!response || response.status >= 400) return null;

    return (
      <Box padding={1} backgroundColor="green">
        <Text bold>✨ Success!</Text>
        <Text> Request completed in {response.time}ms</Text>
      </Box>
    );
  }

  render() {
    const { response, loading } = this.props;
    const { view } = this.state;

    // Show loading state
    if (loading) {
      return this.renderLoading();
    }

    // Show empty state
    if (!response) {
      return this.renderEmpty();
    }

    // Show error state for 4xx/5xx
    const isError = response.status >= 400;

    return (
      <Box direction="column" width="100%" height="100%">
        {/* Response header with status */}
        {this.renderResponseHeader()}

        {/* View tabs */}
        {!isError && this.renderViewTabs()}

        {/* Content area */}
        <Box direction="column" flexGrow={1} overflow="scroll">
          {isError ? (
            this.renderError()
          ) : (
            <>
              {view === "body" && this.renderBody()}
              {view === "headers" && this.renderHeaders()}
              {view === "cookies" && this.renderCookies()}
            </>
          )}
        </Box>

        {/* Footer with tips */}
        <Box padding={1} borderTop borderColor="gray">
          <Text dimColor fontSize={10}>
            {isError
              ? "⚠️ Request failed - check error details above"
              : `✓ Response received successfully`}
          </Text>
        </Box>
      </Box>
    );
  }
}
