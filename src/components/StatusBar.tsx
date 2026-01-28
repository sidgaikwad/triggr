/**
 * StatusBar Component - OpenTUI
 *
 * Bottom status bar showing current status, shortcuts, and tips
 */

import { Component, Box, Text } from "@opentui/core";

interface Props {
  message: string;
}

export class StatusBar extends Component<Props> {
  render() {
    const { message } = this.props;

    return (
      <Box padding={1} borderTop borderColor="gray" backgroundColor="black">
        <Box width="60%">
          <Text color="cyan">● {message}</Text>
        </Box>

        <Box width="40%" justifyContent="flex-end">
          <Text dimColor fontSize={10}>
            Ctrl+C Exit | F1 Help | F2 Env | Ctrl+Enter Send
          </Text>
        </Box>
      </Box>
    );
  }
}
