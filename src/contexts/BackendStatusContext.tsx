import React, { createContext, useState, useContext } from 'react';

type BackendStatus = 'checking' | 'connected' | 'disconnected';

interface BackendStatusContextType {
  backendStatus: BackendStatus;
  setBackendStatus: (status: BackendStatus) => void;
}

export const BackendStatusContext = createContext<BackendStatusContextType>({
  backendStatus: 'checking',
  setBackendStatus: () => {},
});

export const BackendStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [backendStatus, setBackendStatus] = useState<BackendStatus>('checking');

  return (
    <BackendStatusContext.Provider value={{ backendStatus, setBackendStatus }}>
      {children}
    </BackendStatusContext.Provider>
  );
};

export const useBackendStatus = () => useContext(BackendStatusContext);
