/**
 * RequestBuilder Component - OpenTUI
 * 
 * Center panel for building and configuring HTTP requests
 * Includes tabs for Params, Auth, Headers, Body, and Tests
 */

import { Component, Box, Text, Input, Tabs, Select, Button } from '@opentui/core';
import type { Request, Param, Header, Auth, RequestBody, HttpMethod, TabType } from '../types/index';

interface Props {
  request: Request | null;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onRequestChange: (request: Request) => void;
  onSend: (request: Request) => void;
  onSave: (request: Request) => void;
  loading: boolean;
}

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

export class RequestBuilder extends Component<Props, State> {
  private methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

  constructor(props: Props) {
    super(props);
    
    const request = props.request;
    this.state = {
      method: request?.method || 'GET',
      url: request?.url || '',
      params: request?.params || [],
      headers: request?.headers || [],
      body: request?.body || null,
      auth: request?.auth || null,
      selectedParamIndex: 0,
      selectedHeaderIndex: 0,
      focusedField: 'url'
    };
  }

  componentDidUpdate(prevProps: Props) {
    // Update state when request prop changes
    if (prevProps.request !== this.props.request && this.props.request) {
      const request = this.props.request;
      this.setState({
        method: request.method,
        url: request.url,
        params: request.params,
        headers: request.headers,
        body: request.body,
        auth: request.auth
      });
    }
  }

  componentDidMount() {
    // Keyboard shortcuts
    this.on('key:ctrl+enter', () => this.handleSend());
    this.on('key:ctrl+s', () => this.handleSave());
    this.on('key:ctrl+k', () => this.handleAddItem());
    this.on('key:alt+1', () => this.props.onTabChange('params'));
    this.on('key:alt+2', () => this.props.onTabChange('auth'));
    this.on('key:alt+3', () => this.props.onTabChange('headers'));
    this.on('key:alt+4', () => this.props.onTabChange('body'));
    this.on('key:alt+5', () => this.props.onTabChange('tests'));
  }

  /**
   * Build current request object
   */
  getCurrentRequest(): Request {
    const { request } = this.props;
    return {
      id: request?.id || `req_${Date.now()}`,
      name: request?.name || 'New Request',
      method: this.state.method,
      url: this.state.url,
      params: this.state.params,
      headers: this.state.headers,
      body: this.state.body,
      auth: this.state.auth,
      createdAt: request?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Handle send request
   */
  handleSend() {
    if (!this.state.url) return;
    const request = this.getCurrentRequest();
    this.props.onSend(request);
  }

  /**
   * Handle save request
   */
  handleSave() {
    const request = this.getCurrentRequest();
    this.props.onSave(request);
  }

  /**
   * Handle method change
   */
  handleMethodChange(method: HttpMethod) {
    this.setState({ method });
    this.notifyChange();
  }

  /**
   * Handle URL change
   */
  handleUrlChange(url: string) {
    this.setState({ url });
    this.notifyChange();
  }

  /**
   * Notify parent of changes
   */
  notifyChange() {
    const request = this.getCurrentRequest();
    this.props.onRequestChange(request);
  }

  /**
   * Add new param/header based on active tab
   */
  handleAddItem() {
    const { activeTab } = this.props;
    
    if (activeTab === 'params') {
      this.setState({
        params: [
          ...this.state.params,
          { key: '', value: '', enabled: true }
        ]
      });
    } else if (activeTab === 'headers') {
      this.setState({
        headers: [
          ...this.state.headers,
          { key: '', value: '', enabled: true }
        ]
      });
    }
  }

  /**
   * Render method selector and URL input
   */
  renderRequestLine() {
    const { method, url } = this.state;
    const { loading } = this.props;

    return (
      <Box padding={1} borderBottom borderColor="gray">
        <Box width={15}>
          <Select
            value={method}
            options={this.methods}
            onChange={(m) => this.handleMethodChange(m as HttpMethod)}
            disabled={loading}
          />
        </Box>
        <Box flexGrow={1} marginLeft={1}>
          <Input
            value={url}
            onChange={(val) => this.handleUrlChange(val)}
            placeholder="Enter request URL..."
            disabled={loading}
          />
        </Box>
      </Box>
    );
  }

  /**
   * Render Params tab
   */
  renderParamsTab() {
    const { params, selectedParamIndex } = this.state;

    return (
      <Box direction="column" padding={1}>
        <Box marginBottom={1}>
          <Text bold>Query Parameters</Text>
          <Box flexGrow={1} />
          <Text dimColor>(Ctrl+K to add)</Text>
        </Box>

        {params.length === 0 ? (
          <Box padding={2}>
            <Text dimColor>No parameters yet. Press Ctrl+K to add one.</Text>
          </Box>
        ) : (
          <Box direction="column">
            {/* Header row */}
            <Box borderBottom borderColor="gray" padding={1}>
              <Box width={5}><Text dimColor>✓</Text></Box>
              <Box width="40%"><Text dimColor>Key</Text></Box>
              <Box width="60%"><Text dimColor>Value</Text></Box>
            </Box>

            {/* Param rows */}
            {params.map((param, index) => (
              <Box 
                key={index}
                borderBottom 
                borderColor="gray" 
                padding={1}
                backgroundColor={index === selectedParamIndex ? 'blue' : undefined}
              >
                <Box width={5}>
                  <Text>{param.enabled ? '✓' : '☐'}</Text>
                </Box>
                <Box width="40%">
                  <Input
                    value={param.key}
                    onChange={(val) => {
                      const newParams = [...params];
                      newParams[index].key = val;
                      this.setState({ params: newParams });
                    }}
                    placeholder="key"
                  />
                </Box>
                <Box width="60%">
                  <Input
                    value={param.value}
                    onChange={(val) => {
                      const newParams = [...params];
                      newParams[index].value = val;
                      this.setState({ params: newParams });
                    }}
                    placeholder="value"
                  />
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {params.length > 0 && (
          <Box marginTop={1}>
            <Text dimColor fontSize={10}>
              Tip: Use {'{'}{'{'}}variable{'}'}{'}'}  for dynamic values
            </Text>
          </Box>
        )}
      </Box>
    );
  }

  /**
   * Render Auth tab
   */
  renderAuthTab() {
    const { auth } = this.state;
    const authType = auth?.type || 'none';

    return (
      <Box direction="column" padding={1}>
        <Box marginBottom={1}>
          <Text bold>Authentication</Text>
        </Box>

        <Box marginBottom={2}>
          <Text>Type: </Text>
          <Select
            value={authType}
            options={['none', 'bearer', 'basic', 'apikey', 'oauth2', 'jwt']}
            onChange={(type) => {
              if (type === 'none') {
                this.setState({ auth: null });
              } else {
                this.setState({
                  auth: { type: type as any }
                });
              }
            }}
          />
        </Box>

        {authType === 'bearer' && this.renderBearerAuth()}
        {authType === 'basic' && this.renderBasicAuth()}
        {authType === 'apikey' && this.renderApiKeyAuth()}
        {authType === 'oauth2' && this.renderOAuth2Auth()}
        {authType === 'jwt' && this.renderJWTAuth()}

        {authType === 'none' && (
          <Box padding={2}>
            <Text dimColor>No authentication configured</Text>
          </Box>
        )}
      </Box>
    );
  }

  renderBearerAuth() {
    const token = this.state.auth?.bearer?.token || '';

    return (
      <Box direction="column">
        <Text marginBottom={1}>Bearer Token:</Text>
        <Input
          value={token}
          onChange={(val) => {
            this.setState({
              auth: {
                type: 'bearer',
                bearer: { token: val }
              }
            });
          }}
          placeholder="Enter token or {{variable}}"
        />
        <Text dimColor fontSize={10} marginTop={1}>
          Will be added as: Authorization: Bearer [token]
        </Text>
      </Box>
    );
  }

  renderBasicAuth() {
    const username = this.state.auth?.basic?.username || '';
    const password = this.state.auth?.basic?.password || '';

    return (
      <Box direction="column">
        <Text marginBottom={1}>Username:</Text>
        <Input
          value={username}
          onChange={(val) => {
            this.setState({
              auth: {
                type: 'basic',
                basic: {
                  username: val,
                  password: this.state.auth?.basic?.password || ''
                }
              }
            });
          }}
          placeholder="Username"
        />
        
        <Text marginTop={2} marginBottom={1}>Password:</Text>
        <Input
          value={password}
          onChange={(val) => {
            this.setState({
              auth: {
                type: 'basic',
                basic: {
                  username: this.state.auth?.basic?.username || '',
                  password: val
                }
              }
            });
          }}
          placeholder="Password"
          type="password"
        />
      </Box>
    );
  }

  renderApiKeyAuth() {
    const key = this.state.auth?.apiKey?.key || '';
    const value = this.state.auth?.apiKey?.value || '';
    const addTo = this.state.auth?.apiKey?.addTo || 'header';

    return (
      <Box direction="column">
        <Text marginBottom={1}>Key:</Text>
        <Input
          value={key}
          onChange={(val) => {
            const current = this.state.auth?.apiKey;
            this.setState({
              auth: {
                type: 'apikey',
                apiKey: {
                  key: val,
                  value: current?.value || '',
                  addTo: current?.addTo || 'header'
                }
              }
            });
          }}
          placeholder="X-API-Key"
        />
        
        <Text marginTop={2} marginBottom={1}>Value:</Text>
        <Input
          value={value}
          onChange={(val) => {
            const current = this.state.auth?.apiKey;
            this.setState({
              auth: {
                type: 'apikey',
                apiKey: {
                  key: current?.key || '',
                  value: val,
                  addTo: current?.addTo || 'header'
                }
              }
            });
          }}
          placeholder="your-api-key"
        />

        <Box marginTop={2}>
          <Text>Add to: </Text>
          <Select
            value={addTo}
            options={['header', 'query']}
            onChange={(val) => {
              const current = this.state.auth?.apiKey;
              this.setState({
                auth: {
                  type: 'apikey',
                  apiKey: {
                    key: current?.key || '',
                    value: current?.value || '',
                    addTo: val as 'header' | 'query'
                  }
                }
              });
            }}
          />
        </Box>
      </Box>
    );
  }

  renderOAuth2Auth() {
    return (
      <Box direction="column">
        <Text dimColor>OAuth 2.0 configuration</Text>
        <Text dimColor fontSize={10}>
          Full OAuth 2.0 flow coming soon...
        </Text>
      </Box>
    );
  }

  renderJWTAuth() {
    const token = this.state.auth?.jwt?.token || '';

    return (
      <Box direction="column">
        <Text marginBottom={1}>JWT Token:</Text>
        <Input
          value={token}
          onChange={(val) => {
            this.setState({
              auth: {
                type: 'jwt',
                jwt: { token: val, algorithm: 'HS256' }
              }
            });
          }}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        />
      </Box>
    );
  }

  /**
   * Render Headers tab
   */
  renderHeadersTab() {
    const { headers, selectedHeaderIndex } = this.state;

    return (
      <Box direction="column" padding={1}>
        <Box marginBottom={1}>
          <Text bold>Headers</Text>
          <Box flexGrow={1} />
          <Text dimColor>(Ctrl+K to add)</Text>
        </Box>

        {headers.length === 0 ? (
          <Box padding={2}>
            <Text dimColor>No headers yet. Press Ctrl+K to add one.</Text>
          </Box>
        ) : (
          <Box direction="column">
            {/* Header row */}
            <Box borderBottom borderColor="gray" padding={1}>
              <Box width={5}><Text dimColor>✓</Text></Box>
              <Box width="40%"><Text dimColor>Key</Text></Box>
              <Box width="60%"><Text dimColor>Value</Text></Box>
            </Box>

            {/* Header rows */}
            {headers.map((header, index) => (
              <Box 
                key={index}
                borderBottom 
                borderColor="gray" 
                padding={1}
                backgroundColor={index === selectedHeaderIndex ? 'blue' : undefined}
              >
                <Box width={5}>
                  <Text>{header.enabled ? '✓' : '☐'}</Text>
                </Box>
                <Box width="40%">
                  <Input
                    value={header.key}
                    onChange={(val) => {
                      const newHeaders = [...headers];
                      newHeaders[index].key = val;
                      this.setState({ headers: newHeaders });
                    }}
                    placeholder="Content-Type"
                  />
                </Box>
                <Box width="60%">
                  <Input
                    value={header.value}
                    onChange={(val) => {
                      const newHeaders = [...headers];
                      newHeaders[index].value = val;
                      this.setState({ headers: newHeaders });
                    }}
                    placeholder="application/json"
                  />
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {/* Common headers quick add */}
        <Box marginTop={2}>
          <Text dimColor fontSize={10}>Quick add: </Text>
          <Button 
            size="small" 
            onClick={() => this.addCommonHeader('Content-Type', 'application/json')}
          >
            JSON
          </Button>
          <Button 
            size="small" 
            onClick={() => this.addCommonHeader('Accept', 'application/json')}
          >
            Accept JSON
          </Button>
        </Box>
      </Box>
    );
  }

  addCommonHeader(key: string, value: string) {
    this.setState({
      headers: [
        ...this.state.headers,
        { key, value, enabled: true }
      ]
    });
  }

  /**
   * Render Body tab
   */
  renderBodyTab() {
    const { body } = this.state;
    const bodyType = body?.type || 'none';

    return (
      <Box direction="column" padding={1}>
        <Box marginBottom={1}>
          <Text bold>Request Body</Text>
        </Box>

        <Box marginBottom={2}>
          <Text>Body Type: </Text>
          <Select
            value={bodyType}
            options={['none', 'json', 'graphql', 'raw', 'form-data', 'x-www-form-urlencoded']}
            onChange={(type) => {
              if (type === 'none') {
                this.setState({ body: null });
              } else {
                this.setState({
                  body: { type: type as any }
                });
              }
            }}
          />
        </Box>

        {bodyType === 'json' && this.renderJSONBody()}
        {bodyType === 'graphql' && this.renderGraphQLBody()}
        {bodyType === 'raw' && this.renderRawBody()}

        {bodyType === 'none' && (
          <Box padding={2}>
            <Text dimColor>No body (typical for GET requests)</Text>
          </Box>
        )}
      </Box>
    );
  }

  renderJSONBody() {
    const jsonString = this.state.body?.json 
      ? JSON.stringify(this.state.body.json, null, 2)
      : '{\n  \n}';

    return (
      <Box direction="column">
        <Input
          multiline
          rows={10}
          value={jsonString}
          onChange={(val) => {
            try {
              const parsed = JSON.parse(val);
              this.setState({
                body: { type: 'json', json: parsed }
              });
            } catch {
              // Invalid JSON, keep as string
              this.setState({
                body: { type: 'json', raw: val }
              });
            }
          }}
          placeholder='{\n  "key": "value"\n}'
        />
        <Box marginTop={1}>
          <Button size="small">Pretty Print</Button>
          <Button size="small">Validate JSON</Button>
        </Box>
      </Box>
    );
  }

  renderGraphQLBody() {
    const query = this.state.body?.graphql?.query || '';
    const variables = this.state.body?.graphql?.variables || {};

    return (
      <Box direction="column">
        <Text marginBottom={1}>Query:</Text>
        <Input
          multiline
          rows={8}
          value={query}
          onChange={(val) => {
            this.setState({
              body: {
                type: 'graphql',
                graphql: {
                  query: val,
                  variables: this.state.body?.graphql?.variables || {}
                }
              }
            });
          }}
          placeholder="query { ... }"
        />
        
        <Text marginTop={2} marginBottom={1}>Variables (JSON):</Text>
        <Input
          multiline
          rows={4}
          value={JSON.stringify(variables, null, 2)}
          onChange={(val) => {
            try {
              const parsed = JSON.parse(val);
              this.setState({
                body: {
                  type: 'graphql',
                  graphql: {
                    query: this.state.body?.graphql?.query || '',
                    variables: parsed
                  }
                }
              });
            } catch {
              // Invalid JSON
            }
          }}
          placeholder='{\n  "id": "123"\n}'
        />
      </Box>
    );
  }

  renderRawBody() {
    const raw = this.state.body?.raw || '';

    return (
      <Box direction="column">
        <Input
          multiline
          rows={10}
          value={raw}
          onChange={(val) => {
            this.setState({
              body: { type: 'raw', raw: val }
            });
          }}
          placeholder="Enter raw body content..."
        />
      </Box>
    );
  }

  /**
   * Render Tests tab
   */
  renderTestsTab() {
    return (
      <Box direction="column" padding={1}>
        <Text bold marginBottom={1}>Tests & Scripts</Text>
        <Text dimColor>Test scripting coming soon...</Text>
        <Text dimColor fontSize={10} marginTop={1}>
          Write JavaScript to validate responses
        </Text>
      </Box>
    );
  }

  /**
   * Render action buttons
   */
  renderActions() {
    const { loading } = this.props;
    const hasUrl = this.state.url.length > 0;

    return (
      <Box padding={1} borderTop borderColor="gray">
        <Button
          color="cyan"
          onClick={() => this.handleSend()}
          disabled={!hasUrl || loading}
        >
          {loading ? '⏳ Sending...' : '▶ Send Request (Ctrl+Enter)'}
        </Button>
        
        <Button
          marginLeft={1}
          onClick={() => this.handleSave()}
          disabled={!hasUrl}
        >
          💾 Save (Ctrl+S)
        </Button>
        
        <Button
          marginLeft={1}
          onClick={() => {
            this.setState({
              url: '',
              params: [],
              headers: [],
              body: null
            });
          }}
        >
          Clear
        </Button>
      </Box>
    );
  }

  render() {
    const { activeTab } = this.props;
    const tabs = ['Params', 'Auth', 'Headers', 'Body', 'Tests'];

    return (
      <Box direction="column" width="100%" height="100%">
        {/* Request line (Method + URL) */}
        {this.renderRequestLine()}

        {/* Tabs */}
        <Box borderBottom borderColor="gray">
          <Tabs
            tabs={tabs}
            activeTab={tabs.indexOf(
              activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
            )}
            onTabChange={(index) => {
              const tabNames: TabType[] = ['params', 'auth', 'headers', 'body', 'tests'];
              this.props.onTabChange(tabNames[index]);
            }}
          />
        </Box>

        {/* Tab content */}
        <Box direction="column" flexGrow={1} overflow="scroll">
          {activeTab === 'params' && this.renderParamsTab()}
          {activeTab === 'auth' && this.renderAuthTab()}
          {activeTab === 'headers' && this.renderHeadersTab()}
          {activeTab === 'body' && this.renderBodyTab()}
          {activeTab === 'tests' && this.renderTestsTab()}
        </Box>

        {/* Action buttons */}
        {this.renderActions()}
      </Box>
    );
  }
}