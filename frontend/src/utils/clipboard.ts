// src/utils/clipboard.ts

/**
 * Utility function to safely copy text to clipboard
 * Supports both modern and legacy browsers
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      // Modern approach - using Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
  
      // Legacy approach - using execCommand
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Avoid scrolling to bottom
      textArea.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 2em;
        height: 2em;
        padding: 0;
        border: none;
        outline: none;
        boxShadow: none;
        background: transparent;
        opacity: 0;
      `;
  
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
  
      try {
        // Execute the copy command
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      } catch (err) {
        document.body.removeChild(textArea);
        return false;
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      return false;
    }
  };
  
  /**
   * Hook for using clipboard functionality in React components
   */
  export const useClipboard = () => {
    const copyText = async (text: string): Promise<void> => {
      try {
        const success = await copyToClipboard(text);
        if (!success) {
          throw new Error('Copy operation failed');
        }
      } catch (error) {
        console.error('Copy failed:', error);
        // You might want to show a user-friendly error message here
        throw error;
      }
    };
  
    return { copyText };
  };