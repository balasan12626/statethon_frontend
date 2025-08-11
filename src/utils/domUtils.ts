/**
 * Utility functions for safe DOM manipulation that work with React
 */

/**
 * Safely check if an element is still connected to the DOM
 */
export const isElementConnected = (element: Element | null): boolean => {
  return element !== null && element.isConnected;
};

/**
 * Safely set text content of an element with React conflict prevention
 */
export const safeSetTextContent = (
  element: Element | null, 
  text: string
): boolean => {
  if (!isElementConnected(element)) {
    return false;
  }

  try {
    // Use requestAnimationFrame to avoid React DOM conflicts
    requestAnimationFrame(() => {
      if (isElementConnected(element)) {
        element!.textContent = text;
      }
    });
    return true;
  } catch (error) {
    console.warn('Failed to set text content:', error);
    return false;
  }
};

/**
 * Safely set attribute of an element
 */
export const safeSetAttribute = (
  element: Element | null,
  attribute: string,
  value: string
): boolean => {
  if (!isElementConnected(element)) {
    return false;
  }

  try {
    element!.setAttribute(attribute, value);
    return true;
  } catch (error) {
    console.warn('Failed to set attribute:', error);
    return false;
  }
};

/**
 * Safely get elements that are safe to translate (not React-managed)
 */
export const getTranslatableElements = (): Element[] => {
  const allElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, button, label, a, li, td, th, strong, em, b, i, small, caption, figcaption, blockquote, cite, abbr, acronym, time, mark, del, ins, sub, sup, code, pre, kbd, samp, var, dfn, address, article, aside, details, summary, nav, header, footer, main, section');
  
  const translatableElements: Element[] = [];
  
  allElements.forEach((element) => {
    // Skip React-managed elements and already translated elements
    if (element.hasAttribute('data-translated') || 
        element.closest('[data-reactroot]') || 
        element.classList.contains('react-component') ||
        element.getAttribute('data-translate-index') ||
        element.closest('[data-react-component]') ||
        element.closest('[data-testid]') ||
        element.hasAttribute('data-testid')) {
      return;
    }
    
    const text = element.textContent?.trim();
    if (text && text.length > 0 && text.length < 1000) {
      // Skip elements that contain only numbers/symbols
      if (!/^[\d\s\-\+\(\)\[\]\{\}\.\,\;\:\!\@\#\$\%\^\&\*]+$/.test(text)) {
        translatableElements.push(element);
      }
    }
  });
  
  return translatableElements;
};

/**
 * Batch process elements with delay to avoid overwhelming the DOM
 */
export const batchProcessElements = async <T>(
  elements: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<void>,
  delayMs: number = 100
): Promise<void> => {
  for (let i = 0; i < elements.length; i += batchSize) {
    const batch = elements.slice(i, i + batchSize);
    await processor(batch);
    
    if (i + batchSize < elements.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
};

/**
 * Create a unique identifier for DOM elements
 */
export const createElementId = (element: Element, index: number): string => {
  return `translate-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Safely remove element attributes
 */
export const safeRemoveAttribute = (
  element: Element | null,
  attribute: string
): boolean => {
  if (!isElementConnected(element)) {
    return false;
  }

  try {
    element!.removeAttribute(attribute);
    return true;
  } catch (error) {
    console.warn('Failed to remove attribute:', error);
    return false;
  }
};

/**
 * Check if element is a React component
 */
export const isReactComponent = (element: Element): boolean => {
  return !!(
    element.closest('[data-reactroot]') ||
    element.closest('[data-react-component]') ||
    element.hasAttribute('data-testid') ||
    element.classList.contains('react-component')
  );
};

/**
 * Debounce function for DOM operations
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
