/**
 * EnvironmentSelector Component - OpenTUI
 * 
 * Modal for selecting and managing environments (Dev, Staging, Production)
 */

import { Component, Box, Text, List } from '@opentui/core';
import type { Environment } from '../types/index';

interface Props {
  environments: Environment[];
  activeEnv: string;
  onSelect: (envId: string) => void;
  onClose: () => void;
}

interface State {
  selectedIndex: number;
  showVariables: boolean;
}

export class EnvironmentSelector extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    
    this.state = {
      selectedIndex: 0,
      showVariables: false
    };
  }

  componentDidMount() {
    // Keyboard shortcuts
    this.on('key:escape', () => this.props.onClose());
    this.on('key:f2', () => this.props.onClose());
    this.on('key:up', () => this.navigateUp());
    this.on('key:down', () => this.navigateDown());
    this.on('key:enter', () => this.handleSelect());
    this.on('key:v', () => this.toggleVariables());
  }

  navigateUp() {
    this.setState({
      selectedIndex: Math.max(0, this.state.selectedIndex - 1)
    });
  }

  navigateDown() {
    const maxIndex = this.props.environments.length; // +1 for "None" option
    this.setState({
      selectedIndex: Math.min(maxIndex, this.state.selectedIndex + 1)
    });
  }

  handleSelect() {
    const { environments, onSelect } = this.props;
    const { selectedIndex } = this.state;

    if (selectedIndex === 0) {
      // "None" option
      onSelect('none');
    } else {
      // Select environment
      const env = environments[selectedIndex - 1];
      if (env) {
        onSelect(env.id);
      }
    }
  }

  toggleVariables() {
    this.setState({ showVariables: !this.state.showVariables });
  }

  renderEnvironmentItem(env: Environment | null, index: number, isActive: boolean) {
    const isSelected = index === this.state.selectedIndex;
    const name = env ? env.name : 'None';
    const varCount = env ? Object.keys(env.variables).length : 0;

    return (
      <Box 
        key={env?.id || 'none'}
        padding={1}
        borderBottom
        borderColor="gray"
        backgroundColor={isSelected ? 'blue' : undefined}
      >
        <Box width={3}>
          <Text>{isActive ? '●' : '○'}</Text>
        </Box>
        
        <Box width={20}>
          <Text bold={isSelected} color={isActive ? 'cyan' : undefined}>
            {name}
          </Text>
        </Box>
        
        {env && (
          <Box>
            <Text dimColor fontSize={10}>
              {varCount} variable{varCount !== 1 ? 's' : ''}
            </Text>
          </Box>
        )}
      </Box>
    );
  }

  renderVariables() {
    const { environments, activeEnv } = this.props;
    
    if (activeEnv === 'none') {
      return (
        <Box padding={2}>
          <Text dimColor>No environment selected</Text>
        </Box>
      );
    }

    const env = environments.find(e => e.id === activeEnv);
    if (!env) {
      return (
        <Box padding={2}>
          <Text dimColor>Environment not found</Text>
        </Box>
      );
    }

    const variables = Object.entries(env.variables);

    if (variables.length === 0) {
      return (
        <Box padding={2}>
          <Text dimColor>No variables defined</Text>
        </Box>
      );
    }

    return (
      <Box direction="column" padding={1}>
        <Box borderBottom borderColor="gray" padding={1}>
          <Box width="40%"><Text bold>Variable</Text></Box>
          <Box width="60%"><Text bold>Value</Text></Box>
        </Box>

        {variables.map(([key, value], index) => (
          <Box key={index} borderBottom borderColor="gray" padding={1}>
            <Box width="40%">
              <Text color="cyan">{key}</Text>
            </Box>
            <Box width="60%">
              <Text dimColor>{value}</Text>
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  render() {
    const { environments, activeEnv } = this.props;
    const { showVariables } = this.state;

    // Build items list (None + environments)
    const items = [null, ...environments];

    return (
      <Box 
        width="100%" 
        height="100%" 
        alignItems="center" 
        justifyContent="center"
        backgroundColor="rgba(0,0,0,0.8)"
      >
        <Box 
          width={80} 
          direction="column" 
          border="double" 
          borderColor="cyan"
          backgroundColor="black"
        >
          {/* Header */}
          <Box padding={1} borderBottom borderColor="cyan">
            <Text bold color="cyan">🌍 Environment Selector</Text>
            <Box flexGrow={1} />
            <Text dimColor>(↑↓ Enter Esc)</Text>
          </Box>

          {/* Content */}
          <Box direction="row" height={25}>
            {/* Left panel - Environment list */}
            <Box width="50%" direction="column" borderRight borderColor="gray">
              <Box padding={1} borderBottom borderColor="gray">
                <Text bold>Select Environment:</Text>
              </Box>

              <Box direction="column" flexGrow={1} overflow="scroll">
                {items.map((env, index) => 
                  this.renderEnvironmentItem(
                    env,
                    index,
                    (env?.id || 'none') === activeEnv
                  )
                )}
              </Box>

              <Box padding={1} borderTop borderColor="gray">
                <Text dimColor fontSize={10}>
                  {environments.length} environment{environments.length !== 1 ? 's' : ''} available
                </Text>
              </Box>
            </Box>

            {/* Right panel - Variables */}
            <Box width="50%" direction="column">
              <Box padding={1} borderBottom borderColor="gray">
                <Text bold>Current Variables:</Text>
                <Box flexGrow={1} />
                <Text dimColor fontSize={10}>(V to toggle)</Text>
              </Box>

              <Box direction="column" flexGrow={1} overflow="scroll">
                {showVariables ? (
                  this.renderVariables()
                ) : (
                  <Box padding={2} alignItems="center" justifyContent="center">
                    <Text dimColor>Press V to view variables</Text>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {/* Footer */}
          <Box padding={1} borderTop borderColor="gray">
            <Text dimColor fontSize={10}>
              💡 Variables: Use {'{'}{'{'}}var_name{'}'}{'}'}  in requests
            </Text>
            <Box flexGrow={1} />
            <Text dimColor fontSize={10}>
              Press Esc to close
            </Text>
          </Box>
        </Box>
      </Box>
    );
  }
}