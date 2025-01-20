import mermaid from 'mermaid';
import { nanoid } from 'nanoid';
import React, { useEffect } from 'react';

mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'monospace',
});

interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const id = nanoid();
  useEffect(() => {
    const element = document.getElementById(id);
    if (element?.hasAttribute('data-processed')) element.removeAttribute('data-processed');
    mermaid.contentLoaded();
  }, [chart]);

  return (
    <pre
      id={id}
      className="mermaid"
    >
      {chart}
    </pre>
  );
};

export default Mermaid;
