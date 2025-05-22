import React from 'react';
import { FiInfo, FiAlertTriangle, FiCheckCircle, FiLink, FiImage, FiCode, FiList, FiCheckSquare, FiSquare } from 'react-icons/fi';

// Main NotionUI component that renders different block types
export const NotionUI = ({ blocks, darkMode }) => {
  if (!blocks || !Array.isArray(blocks)) return null;

  return (
    <div className={`notion-content ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading_1':
            return <HeadingOne key={index} content={block.content} id={block.id} darkMode={darkMode} />;
          case 'heading_2':
            return <HeadingTwo key={index} content={block.content} id={block.id} darkMode={darkMode} />;
          case 'heading_3':
            return <HeadingThree key={index} content={block.content} id={block.id} darkMode={darkMode} />;
          case 'paragraph':
            return <Paragraph key={index} content={block.content} darkMode={darkMode} />;
          case 'bulleted_list':
            return <BulletedList key={index} items={block.items} darkMode={darkMode} />;
          case 'numbered_list':
            return <NumberedList key={index} items={block.items} darkMode={darkMode} />;
          case 'toggle':
            return <Toggle key={index} summary={block.summary} content={block.content} darkMode={darkMode} />;
          case 'callout':
            return <Callout key={index} content={block.content} icon={block.icon} color={block.color} darkMode={darkMode} />;
          case 'quote':
            return <Quote key={index} content={block.content} darkMode={darkMode} />;
          case 'divider':
            return <Divider key={index} darkMode={darkMode} />;
          case 'code':
            return <CodeBlock key={index} content={block.content} language={block.language} darkMode={darkMode} />;
          case 'image':
            return <Image key={index} url={block.url} caption={block.caption} darkMode={darkMode} />;
          case 'checkbox':
            return <Checkbox key={index} items={block.items} darkMode={darkMode} />;
          case 'table':
            return <Table key={index} rows={block.rows} darkMode={darkMode} />;
          default:
            return <Paragraph key={index} content={`Unsupported block type: ${block.type}`} darkMode={darkMode} />;
        }
      })}
    </div>
  );
};

// Heading components
const HeadingOne = ({ content, id, darkMode }) => (
  <h1 
    id={id} 
    className={`text-2xl font-bold mt-6 mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}
  >
    {content}
  </h1>
);

const HeadingTwo = ({ content, id, darkMode }) => (
  <h2 
    id={id} 
    className={`text-xl font-bold mt-5 mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}
  >
    {content}
  </h2>
);

const HeadingThree = ({ content, id, darkMode }) => (
  <h3 
    id={id} 
    className={`text-lg font-bold mt-4 mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}
  >
    {content}
  </h3>
);

// Paragraph component
const Paragraph = ({ content, darkMode }) => (
  <p className={`my-3 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
    {content}
  </p>
);

// List components
const BulletedList = ({ items, darkMode }) => (
  <ul className="list-disc pl-6 my-3 space-y-1">
    {items.map((item, index) => (
      <li key={index} className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item}</li>
    ))}
  </ul>
);

const NumberedList = ({ items, darkMode }) => (
  <ol className="list-decimal pl-6 my-3 space-y-1">
    {items.map((item, index) => (
      <li key={index} className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item}</li>
    ))}
  </ol>
);

// Toggle component
const Toggle = ({ summary, content, darkMode }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="my-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center w-full text-left p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
      >
        <span className="mr-2 transform transition-transform">
          {isOpen ? '▼' : '►'}
        </span>
        <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{summary}</span>
      </button>
      {isOpen && (
        <div className={`pl-6 mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {content}
        </div>
      )}
    </div>
  );
};

// Callout component
const Callout = ({ content, icon, color = 'default', darkMode }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return darkMode ? 'bg-blue-900 bg-opacity-30 border-blue-700' : 'bg-blue-50 border-blue-200';
      case 'red':
        return darkMode ? 'bg-red-900 bg-opacity-30 border-red-700' : 'bg-red-50 border-red-200';
      case 'green':
        return darkMode ? 'bg-green-900 bg-opacity-30 border-green-700' : 'bg-green-50 border-green-200';
      case 'yellow':
        return darkMode ? 'bg-yellow-900 bg-opacity-30 border-yellow-700' : 'bg-yellow-50 border-yellow-200';
      case 'gray':
      default:
        return darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200';
    }
  };

  const getIcon = () => {
    switch (icon) {
      case 'info':
        return <FiInfo className={`flex-shrink-0 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />;
      case 'warning':
        return <FiAlertTriangle className={`flex-shrink-0 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />;
      case 'success':
        return <FiCheckCircle className={`flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />;
      default:
        return icon || <FiInfo className={`flex-shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />;
    }
  };

  return (
    <div className={`flex p-4 my-4 rounded-md border ${getColorClasses()}`}>
      <div className="mr-3 mt-0.5">{getIcon()}</div>
      <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{content}</div>
    </div>
  );
};

// Quote component
const Quote = ({ content, darkMode }) => (
  <blockquote className={`pl-4 my-4 border-l-4 ${darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-600'}`}>
    {content}
  </blockquote>
);

// Divider component
const Divider = ({ darkMode }) => (
  <hr className={`my-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
);

// Code block component
const CodeBlock = ({ content, language, darkMode }) => (
  <div className="my-4">
    {language && (
      <div className={`text-xs px-4 py-1 rounded-t-md ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
        {language}
      </div>
    )}
    <pre className={`p-4 rounded-md ${language ? 'rounded-t-none' : ''} overflow-x-auto ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
      <code>{content}</code>
    </pre>
  </div>
);

// Image component
const Image = ({ url, caption, darkMode }) => (
  <figure className="my-4">
    <img 
      src={url} 
      alt={caption || 'Image'} 
      className="rounded-md max-w-full"
    />
    {caption && (
      <figcaption className={`mt-2 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {caption}
      </figcaption>
    )}
  </figure>
);

// Checkbox component
const Checkbox = ({ items, darkMode }) => (
  <div className="my-3 space-y-1">
    {items.map((item, index) => (
      <div key={index} className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          {item.checked ? (
            <FiCheckSquare className={darkMode ? 'text-indigo-400' : 'text-indigo-600'} />
          ) : (
            <FiSquare className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
          )}
        </div>
        <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} ${item.checked ? 'line-through opacity-70' : ''}`}>
          {item.text}
        </span>
      </div>
    ))}
  </div>
);

// Table component
const Table = ({ rows, darkMode }) => (
  <div className="my-4 overflow-x-auto">
    <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
      <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
        <tr>
          {rows[0].map((cell, cellIndex) => (
            <th 
              key={cellIndex} 
              className={`px-4 py-2 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              {cell}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
        {rows.slice(1).map((row, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? (darkMode ? 'bg-gray-900' : 'bg-white') : (darkMode ? 'bg-gray-800' : 'bg-gray-50')}>
            {row.map((cell, cellIndex) => (
              <td 
                key={cellIndex} 
                className={`px-4 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default NotionUI;