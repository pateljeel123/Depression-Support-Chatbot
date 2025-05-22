import React from 'react';

/**
 * Converts markdown text to Notion UI blocks format
 * @param {string} markdown - The markdown text to convert
 * @returns {Array} - Array of Notion UI blocks
 */
export const convertMarkdownToNotionBlocks = (markdown) => {
  if (!markdown) return [];
  
  const blocks = [];
  const lines = markdown.split('\n');
  
  let currentListItems = [];
  let currentListType = null;
  let codeBlockLines = [];
  let currentCodeLanguage = '';
  let inCodeBlock = false;
  
  const processListItems = () => {
    if (currentListItems.length > 0) {
      blocks.push({
        type: currentListType,
        items: [...currentListItems]
      });
      currentListItems = [];
      currentListType = null;
    }
  };
  
  const processCodeBlock = () => {
    if (codeBlockLines.length > 0) {
      blocks.push({
        type: 'code',
        language: currentCodeLanguage,
        content: codeBlockLines.join('\n')
      });
      codeBlockLines = [];
      currentCodeLanguage = '';
      inCodeBlock = false;
    }
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Handle code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        processCodeBlock();
      } else {
        inCodeBlock = true;
        currentCodeLanguage = line.slice(3).trim();
      }
      continue;
    }
    
    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }
    
    // Process any pending list before starting a new block type
    if (!line.trim().startsWith('-') && !line.trim().startsWith('*') && !line.trim().match(/^\d+\./) && currentListType) {
      processListItems();
    }
    
    // Heading 1
    if (line.startsWith('# ')) {
      blocks.push({
        type: 'heading_1',
        content: line.slice(2).trim(),
        id: `heading-${blocks.length}`
      });
    }
    // Heading 2
    else if (line.startsWith('## ')) {
      blocks.push({
        type: 'heading_2',
        content: line.slice(3).trim(),
        id: `heading-${blocks.length}`
      });
    }
    // Heading 3
    else if (line.startsWith('### ')) {
      blocks.push({
        type: 'heading_3',
        content: line.slice(4).trim(),
        id: `heading-${blocks.length}`
      });
    }
    // Bulleted list
    else if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
      const item = line.replace(/^\s*[-*]\s*/, '').trim();
      if (item) {
        if (currentListType !== 'bulleted_list') {
          processListItems(); // Process any previous list of different type
          currentListType = 'bulleted_list';
        }
        currentListItems.push(item);
      }
    }
    // Numbered list
    else if (line.trim().match(/^\d+\./)) {
      const item = line.replace(/^\s*\d+\.\s*/, '').trim();
      if (item) {
        if (currentListType !== 'numbered_list') {
          processListItems(); // Process any previous list of different type
          currentListType = 'numbered_list';
        }
        currentListItems.push(item);
      }
    }
    // Blockquote
    else if (line.startsWith('> ')) {
      blocks.push({
        type: 'quote',
        content: line.slice(2).trim()
      });
    }
    // Divider
    else if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
      blocks.push({
        type: 'divider'
      });
    }
    // Callout - Info (custom syntax for demonstration)
    else if (line.startsWith('!> ')) {
      blocks.push({
        type: 'callout',
        content: line.slice(3).trim(),
        icon: 'info',
        color: 'blue'
      });
    }
    // Callout - Warning (custom syntax for demonstration)
    else if (line.startsWith('!!> ')) {
      blocks.push({
        type: 'callout',
        content: line.slice(4).trim(),
        icon: 'warning',
        color: 'yellow'
      });
    }
    // Callout - Success (custom syntax for demonstration)
    else if (line.startsWith('✓> ')) {
      blocks.push({
        type: 'callout',
        content: line.slice(3).trim(),
        icon: 'success',
        color: 'green'
      });
    }
    // Checkbox (custom syntax for demonstration)
    else if (line.trim().startsWith('[x] ') || line.trim().startsWith('[ ] ')) {
      const isChecked = line.trim().startsWith('[x] ');
      const text = line.replace(/^\s*\[[x ]\]\s*/, '').trim();
      
      // Find the last checkbox block or create a new one
      const lastBlock = blocks[blocks.length - 1];
      if (lastBlock && lastBlock.type === 'checkbox') {
        lastBlock.items.push({ text, checked: isChecked });
      } else {
        blocks.push({
          type: 'checkbox',
          items: [{ text, checked: isChecked }]
        });
      }
    }
    // Toggle (custom syntax for demonstration)
    else if (line.trim().startsWith('>>> ')) {
      const parts = line.trim().slice(4).split(':');
      if (parts.length >= 2) {
        const summary = parts[0].trim();
        const content = parts.slice(1).join(':').trim();
        blocks.push({
          type: 'toggle',
          summary,
          content
        });
      }
    }
    // Regular paragraph (non-empty line)
    else if (line.trim()) {
      blocks.push({
        type: 'paragraph',
        content: line.trim()
      });
    }
  }
  
  // Process any remaining list items
  processListItems();
  
  // Process any remaining code block
  if (inCodeBlock) {
    processCodeBlock();
  }
  
  return blocks;
};

/**
 * Component that converts markdown to Notion UI format
 */
export const NotionUIConverter = ({ markdown, darkMode }) => {
  const { NotionUI } = require('./NotionUI');
  const blocks = convertMarkdownToNotionBlocks(markdown);
  
  return <NotionUI blocks={blocks} darkMode={darkMode} />;
};

export default NotionUIConverter;