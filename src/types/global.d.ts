// Global type declarations for the application

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: any;
        InlineLayout: {
          SIMPLE: any;
        };
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

// NodeJS namespace for timeout types
declare namespace NodeJS {
  interface Timeout {
    ref(): this;
    unref(): this;
  }
}

export {};
