/**
 * HelpModal Component - OpenTUI
 * 
 * Modal overlay showing keyboard shortcuts and help information
 */

import { Component, Box, Text } from '@opentui/core';

interface Props {
  onClose: () => void;
}

export class HelpModal extends Component<Props> {
  componentDidMount() {
    // Close on Escape or F1
    this.on('key:escape', () => this.props.onClose());
    this.on('key:f1', () => this.props.onClose());
  }

  render() {
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
          padding={2}
        >
          {/* Header */}
          <Box marginBottom={2} justifyContent="center">
            <Text bold color="cyan" fontSize={16}>⚡ TERMIN API - Help</Text>
          </Box>

          {/* Content in columns */}
          <Box>
            {/* Left column */}
            <Box direction="column" width="50%">
              <Text bold color="yellow" marginBottom={1}>Global Shortcuts</Text>
              
              <Box marginBottom={1}>
                <Box width={15}><Text dimColor>Ctrl+C</Text></Box>
                <Text>Quit application</Text>
              </Box>
              
              <Box marginBottom={1}>
                <Box width={15}><Text dimColor>Ctrl+N</Text></Box>
                <Text>New request</Text>
              </Box>
              
              <Box marginBottom={1}>
                <Box width={15}><Text dimColor>Ctrl+S</Text></Box>
                <Text>Save request</Text>
              </Box>
              
              <Box marginBottom={1}>
                <Box width={15}><Text dimColor>Ctrl+Enter</Text></Box>
                <Text>Send request</Text>
              </Box>
              
              <Box marginBottom={1}>
                <Box width={15}><Text dimColor>F1</Text></Box>
                <Text>Toggle help</Text>
              </Box>
              
              <Box marginBottom={1}>
                <Box width={15}><Text dimColor>F2</Text></Box>
                <Text>Environments</Text>
              </Box>

              <Text bold color="yellow" marginTop={2} marginBottom={1}>Navigation</Text>
              
              <Box marginBottom={1}>
                <Box width={15}><Text dimColor>Tab</Text></Box>
                <Text>Next field</Text>
              </Box>
              
              <Box marginBottom={1}>
                <Box width={15}><Text dimColor>Shift+Tab</Text></Box>
                <Text>Previous field</Text>
              </Box>
              
              <Box marginBottom={1}>
                <Box width={15}><Text dimColor>↑/↓</Text></Box>
                <Text>Navigate lists</Text>
              </Box>
              
              <Box marginBottom={1}>
                <Box width={15}><Text dimColor>Enter</Text></Box>
                <Text>Select item</Text>
              </Box>
            </Box>

            {/* Right column */}
            <Box direction="column" width="50%">
              <Text bold color="yellow" marginBottom={1}>Request Builder</Text>
              
              <Box marginBottom={1}>
                <Box width={15}><Text dimColor>Alt+1</Text></Box>
                <Text>Params tab</Text>
              </Box>
              
              <Box marginBottom={1}>
                <Box width={15}><Text dimColor>Alt+2</Text></Box>
                <Text>Auth tab</Text>
              </Box>
              
              <Box marginBottom={1}>
                <Box width={15}><Text dimColor>Alt+3</Text></Box>
                <Text>Headers tab</Text>
              </Box>
              
              <Box marginBottom={1}>
                <Box width={15}><Text dimColor>Alt+4</Text></Box>
                <Text>Body tab</Text>
              </Box>
              
              <Box marginBottom={1}>
                <Box width={15}><Text dimColor>Alt+5</Text></Box>
                <Text>Tests tab</Text>
              </Box>
              
              <Box marginBottom={1}>
                <Box width={15}><Text dimColor>Ctrl+K</Text></Box>
                <Text>Add param/header</Text>
              </Box>

              <Text bold color="yellow" marginTop={2} marginBottom={1}>Collections</Text>
              
              <Box marginBottom={1}>
                <Box width={15}><Text dimColor>+</Text></Box>
                <Text>New collection</Text>
              </Box>
              
              <Box marginBottom={1}>
                <Box width={15}><Text dimColor>Delete</Text></Box>
                <Text>Delete item</Text>
              </Box>
              
              <Box marginBottom={1}>
                <Box width={15}><Text dimColor>/</Text></Box>
                <Text>Search</Text>
              </Box>

              <Text bold color="yellow" marginTop={2} marginBottom={1}>Response Viewer</Text>
              
              <Box marginBottom={1}>
                <Box width={15}><Text dimColor>1</Text></Box>
                <Text>Body view</Text>
              </Box>
              
              <Box marginBottom={1}>
                <Box width={15}><Text dimColor>2</Text></Box>
                <Text>Headers view</Text>
              </Box>
              
              <Box marginBottom={1}>
                <Box width={15}><Text dimColor>3</Text></Box>
                <Text>Cookies view</Text>
              </Box>
              
              <Box marginBottom={1}>
                <Box width={15}><Text dimColor>P</Text></Box>
                <Text>Toggle pretty print</Text>
              </Box>
            </Box>
          </Box>

          {/* Tips section */}
          <Box 
            direction="column" 
            marginTop={2} 
            padding={1} 
            border 
            borderColor="yellow"
          >
            <Text bold color="yellow">💡 Tips</Text>
            <Text dimColor fontSize={10}>
              • Use {'{'}{'{'}}variable{'}'}{'}'}  syntax for dynamic values
            </Text>
            <Text dimColor fontSize={10}>
              • Collections are saved in ~/.termin-api/
            </Text>
            <Text dimColor fontSize={10}>
              • Press Ctrl+S frequently to save your work
            </Text>
            <Text dimColor fontSize={10}>
              • Use environments to switch between Dev/Staging/Prod
            </Text>
          </Box>

          {/* Footer */}
          <Box marginTop={2} justifyContent="center">
            <Text dimColor>Press Esc or F1 to close this help</Text>
          </Box>
        </Box>
      </Box>
    );
  }
}