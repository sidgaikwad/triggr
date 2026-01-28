/**
 * CollectionBrowser Component - OpenTUI
 * 
 * Displays collections and folders in a tree view on the left sidebar
 * Allows navigation, selection, and management of collections and requests
 */

import { Component, Box, Text, List } from '@opentui/core';
import type { Collection, Request, Folder } from '../types/index';

interface Props {
  collections: Collection[];
  selectedCollection: string | null;
  onSelectCollection: (id: string) => void;
  onSelectRequest: (request: Request) => void;
  onCreateCollection?: (name: string) => void;
  onDeleteCollection?: (id: string) => void;
  onCreateFolder?: (collectionId: string, name: string) => void;
}

interface State {
  selectedIndex: number;
  expandedCollections: Set<string>;
  expandedFolders: Set<string>;
  searchQuery: string;
  showNewCollectionPrompt: boolean;
}

interface ListItem {
  type: 'collection' | 'folder' | 'request';
  id: string;
  data: Collection | Folder | Request;
  indent: number;
  parentId?: string;
}

export class CollectionBrowser extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    
    this.state = {
      selectedIndex: 0,
      expandedCollections: new Set(),
      expandedFolders: new Set(),
      searchQuery: '',
      showNewCollectionPrompt: false
    };
  }

  componentDidMount() {
    // Keyboard shortcuts for collection browser
    this.on('key:up', () => this.navigateUp());
    this.on('key:down', () => this.navigateDown());
    this.on('key:enter', () => this.handleSelect());
    this.on('key:space', () => this.handleToggleExpand());
    this.on('key:+', () => this.handleNewCollection());
    this.on('key:delete', () => this.handleDelete());
    this.on('key:/', () => this.handleSearch());
  }

  /**
   * Build flat list of items for display
   */
  buildItemList(): ListItem[] {
    const items: ListItem[] = [];
    const { collections } = this.props;
    const { expandedCollections, expandedFolders, searchQuery } = this.state;

    collections.forEach(collection => {
      // Add collection item
      items.push({
        type: 'collection',
        id: collection.id,
        data: collection,
        indent: 0
      });

      // If expanded, add folders and requests
      if (expandedCollections.has(collection.id)) {
        // Add folders
        collection.folders.forEach(folder => {
          items.push({
            type: 'folder',
            id: folder.id,
            data: folder,
            indent: 1,
            parentId: collection.id
          });

          // If folder expanded, add its requests
          if (expandedFolders.has(folder.id)) {
            folder.requests.forEach(requestId => {
              const request = collection.requests.find(r => r.id === requestId);
              if (request) {
                items.push({
                  type: 'request',
                  id: request.id,
                  data: request,
                  indent: 2,
                  parentId: folder.id
                });
              }
            });
          }
        });

        // Add requests not in folders
        const requestsInFolders = new Set(
          collection.folders.flatMap(f => f.requests)
        );
        collection.requests
          .filter(r => !requestsInFolders.has(r.id))
          .forEach(request => {
            items.push({
              type: 'request',
              id: request.id,
              data: request,
              indent: 1,
              parentId: collection.id
            });
          });
      }
    });

    // Filter by search query if present
    if (searchQuery) {
      return items.filter(item => {
        if (item.type === 'collection') {
          return (item.data as Collection).name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        } else if (item.type === 'request') {
          return (item.data as Request).name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        }
        return true;
      });
    }

    return items;
  }

  /**
   * Navigation handlers
   */
  navigateUp() {
    const items = this.buildItemList();
    this.setState({
      selectedIndex: Math.max(0, this.state.selectedIndex - 1)
    });
  }

  navigateDown() {
    const items = this.buildItemList();
    this.setState({
      selectedIndex: Math.min(items.length - 1, this.state.selectedIndex + 1)
    });
  }

  /**
   * Handle selection (Enter key)
   */
  handleSelect() {
    const items = this.buildItemList();
    const item = items[this.state.selectedIndex];
    
    if (!item) return;

    switch (item.type) {
      case 'collection':
        this.props.onSelectCollection(item.id);
        this.toggleExpanded(item.id, 'collection');
        break;
      
      case 'folder':
        this.toggleExpanded(item.id, 'folder');
        break;
      
      case 'request':
        this.props.onSelectRequest(item.data as Request);
        break;
    }
  }

  /**
   * Toggle expand/collapse (Spacebar)
   */
  handleToggleExpand() {
    const items = this.buildItemList();
    const item = items[this.state.selectedIndex];
    
    if (!item) return;

    if (item.type === 'collection') {
      this.toggleExpanded(item.id, 'collection');
    } else if (item.type === 'folder') {
      this.toggleExpanded(item.id, 'folder');
    }
  }

  toggleExpanded(id: string, type: 'collection' | 'folder') {
    if (type === 'collection') {
      const expanded = new Set(this.state.expandedCollections);
      if (expanded.has(id)) {
        expanded.delete(id);
      } else {
        expanded.add(id);
      }
      this.setState({ expandedCollections: expanded });
    } else {
      const expanded = new Set(this.state.expandedFolders);
      if (expanded.has(id)) {
        expanded.delete(id);
      } else {
        expanded.add(id);
      }
      this.setState({ expandedFolders: expanded });
    }
  }

  /**
   * Create new collection
   */
  handleNewCollection() {
    this.setState({ showNewCollectionPrompt: true });
  }

  /**
   * Delete selected item
   */
  handleDelete() {
    const items = this.buildItemList();
    const item = items[this.state.selectedIndex];
    
    if (!item || item.type !== 'collection') return;
    
    if (this.props.onDeleteCollection) {
      this.props.onDeleteCollection(item.id);
    }
  }

  /**
   * Search in collections
   */
  handleSearch() {
    // This would trigger a search input overlay
    // For now, just placeholder
  }

  /**
   * Get icon for item
   */
  getIcon(item: ListItem): string {
    switch (item.type) {
      case 'collection':
        const isExpanded = this.state.expandedCollections.has(item.id);
        return isExpanded ? '📂' : '📁';
      
      case 'folder':
        const isFolderExpanded = this.state.expandedFolders.has(item.id);
        return isFolderExpanded ? '📂' : '📁';
      
      case 'request':
        return '📄';
      
      default:
        return '•';
    }
  }

  /**
   * Get color for HTTP method
   */
  getMethodColor(method: string): string {
    const colors: Record<string, string> = {
      'GET': 'green',
      'POST': 'blue',
      'PUT': 'yellow',
      'PATCH': 'yellow',
      'DELETE': 'red',
      'HEAD': 'gray',
      'OPTIONS': 'gray'
    };
    return colors[method] || 'white';
  }

  /**
   * Render item
   */
  renderItem(item: ListItem, isSelected: boolean) {
    const indent = '  '.repeat(item.indent);
    const cursor = isSelected ? '► ' : '  ';
    const icon = this.getIcon(item);

    if (item.type === 'collection') {
      const collection = item.data as Collection;
      return (
        <Box key={item.id}>
          <Text color={isSelected ? 'cyan' : undefined} bold={isSelected}>
            {cursor}{icon} {collection.name}
            <Text dimColor> ({collection.requests.length})</Text>
          </Text>
        </Box>
      );
    }

    if (item.type === 'folder') {
      const folder = item.data as Folder;
      return (
        <Box key={item.id}>
          <Text color={isSelected ? 'cyan' : undefined}>
            {cursor}{indent}{icon} {folder.name}
            <Text dimColor> ({folder.requests.length})</Text>
          </Text>
        </Box>
      );
    }

    if (item.type === 'request') {
      const request = item.data as Request;
      const methodColor = this.getMethodColor(request.method);
      
      return (
        <Box key={item.id}>
          <Text color={isSelected ? 'cyan' : undefined}>
            {cursor}{indent}{icon}{' '}
            <Text color={methodColor} bold>{request.method}</Text>
            {' '}{request.name}
          </Text>
        </Box>
      );
    }

    return null;
  }

  /**
   * Render empty state
   */
  renderEmpty() {
    return (
      <Box direction="column" padding={2} alignItems="center">
        <Text dimColor>No collections yet</Text>
        <Text dimColor>Press '+' to create one</Text>
      </Box>
    );
  }

  /**
   * Render collection count summary
   */
  renderSummary() {
    const { collections } = this.props;
    const totalRequests = collections.reduce(
      (sum, col) => sum + col.requests.length,
      0
    );

    return (
      <Box padding={1} borderTop borderColor="gray">
        <Text dimColor>
          {collections.length} collections • {totalRequests} requests
        </Text>
      </Box>
    );
  }

  render() {
    const { collections } = this.props;
    const items = this.buildItemList();

    return (
      <Box direction="column" width="100%" height="100%">
        {/* Header */}
        <Box padding={1} borderBottom borderColor="gray">
          <Text bold color="cyan">📁 Collections</Text>
          <Box flexGrow={1} />
          <Text dimColor>(↑↓ Enter)</Text>
        </Box>

        {/* List */}
        <Box direction="column" flexGrow={1} overflow="scroll">
          {collections.length === 0 ? (
            this.renderEmpty()
          ) : (
            items.map((item, index) => 
              this.renderItem(item, index === this.state.selectedIndex)
            )
          )}
        </Box>

        {/* Footer */}
        {collections.length > 0 && this.renderSummary()}

        {/* Action hints */}
        <Box padding={1} borderTop borderColor="gray">
          <Text dimColor fontSize={10}>
            + New | Del Delete | / Search
          </Text>
        </Box>
      </Box>
    );
  }
}