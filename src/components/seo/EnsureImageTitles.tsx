import { useEffect } from 'react';

const DEFAULT_IMAGE_TITLE = 'Boltcall image';

function setMissingImageTitles(root: ParentNode) {
  const images = root.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.getAttribute('title')) {
      const alt = (img.getAttribute('alt') || '').trim();
      img.setAttribute('title', alt || DEFAULT_IMAGE_TITLE);
    }
  });
}

const EnsureImageTitles: React.FC = () => {
  useEffect(() => {
    setMissingImageTitles(document);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== 'childList') continue;
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          const element = node as Element;
          if (element.tagName === 'IMG') {
            if (!element.getAttribute('title')) {
              const alt = (element.getAttribute('alt') || '').trim();
              element.setAttribute('title', alt || DEFAULT_IMAGE_TITLE);
            }
            return;
          }
          setMissingImageTitles(element);
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
};

export default EnsureImageTitles;

