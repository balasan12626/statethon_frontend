import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Modern Card Component with Glass Effect
interface CardProps {
  title: string;
  description: string;
  image?: string;
  className?: string;
  children?: React.ReactNode;
}

export const GlassCard: React.FC<CardProps> = ({
  title,
  description,
  image,
  className = '',
  children
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`card glass bg-opacity-40 backdrop-blur-lg ${className}`}
  >
    {image && (
      <figure className="px-4 pt-4">
        <img src={image} alt={title} className="rounded-xl object-cover w-full h-48" />
      </figure>
    )}
    <div className="card-body">
      <h2 className="card-title font-display text-2xl">{title}</h2>
      <p className="text-base-content/80">{description}</p>
      {children}
    </div>
  </motion.div>
);

// Modern Button with Gradient Effect
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isLoading?: boolean;
}

export const ModernButton: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  className = '',
  isLoading = false
}) => {
  const baseClasses = 'btn transition-all duration-300 ease-out transform hover:scale-105';
  const variantClasses = {
    primary: 'btn-primary bg-gradient-to-r from-primary to-primary-focus text-white',
    secondary: 'btn-secondary bg-gradient-to-r from-secondary to-secondary-focus text-white',
    accent: 'btn-accent bg-gradient-to-r from-accent to-accent-focus text-white',
    ghost: 'btn-ghost hover:bg-base-200'
  };
  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg'
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-sm"></span>
      ) : children}
    </button>
  );
};

// Modern Input with Floating Label
interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
}

export const FloatingInput: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  className = ''
}) => (
  <div className={`form-control w-full ${className}`}>
    <label className="input-group input-group-vertical">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        className={`input input-bordered w-full peer ${
          error ? 'input-error' : ''
        }`}
      />
      <span className="label-text bg-base-100 px-2 transition-all duration-300 ease-out
        peer-placeholder-shown:top-[50%] peer-placeholder-shown:text-base-content/60
        peer-focus:top-0 peer-focus:text-sm peer-focus:text-primary">
        {label}
      </span>
    </label>
    {error && (
      <label className="label">
        <span className="label-text-alt text-error">{error}</span>
      </label>
    )}
  </div>
);

// Modern Alert Component
interface AlertProps {
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  onClose?: () => void;
}

export const ModernAlert: React.FC<AlertProps> = ({ type, message, onClose }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`alert alert-${type} shadow-lg`}
    >
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-2">
          {type === 'info' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          {type === 'success' && <svg xmlns="http://www.w3.org/2000/svg" className="stroke-success flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          {type === 'warning' && <svg xmlns="http://www.w3.org/2000/svg" className="stroke-warning flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
          {type === 'error' && <svg xmlns="http://www.w3.org/2000/svg" className="stroke-error flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          <span>{message}</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="btn btn-ghost btn-sm">✕</button>
        )}
      </div>
    </motion.div>
  </AnimatePresence>
);

// Modern Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const ModernModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="modal modal-open modal-bottom sm:modal-middle z-50"
        >
          <div className="modal-box bg-base-100">
            <h3 className="font-bold text-lg">{title}</h3>
            <div className="py-4">{children}</div>
            <div className="modal-action">
              <button onClick={onClose} className="btn">Close</button>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// Modern Tabs Component
interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export const ModernTabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => (
  <div className="w-full">
    <div className="tabs tabs-lifted">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab tab-lifted ${activeTab === tab.id ? 'tab-active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
    <div className="p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {tabs.find(tab => tab.id === activeTab)?.content}
        </motion.div>
      </AnimatePresence>
    </div>
  </div>
);

// Modern Badge Component
interface BadgeProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ModernBadge: React.FC<BadgeProps> = ({
  text,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const variantClasses = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    accent: 'badge-accent',
    ghost: 'badge-ghost'
  };
  const sizeClasses = {
    sm: 'badge-sm',
    md: 'badge-md',
    lg: 'badge-lg'
  };

  return (
    <div className={`badge ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {text}
    </div>
  );
};

// Modern Tooltip Component
interface TooltipProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}

export const ModernTooltip: React.FC<TooltipProps> = ({
  text,
  position = 'top',
  children
}) => (
  <div className={`tooltip tooltip-${position}`} data-tip={text}>
    {children}
  </div>
);

// Modern Progress Bar
interface ProgressProps {
  value: number;
  max?: number;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const ModernProgress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  color = 'primary',
  size = 'md',
  className = ''
}) => (
  <progress
    className={`progress progress-${color} progress-${size} ${className}`}
    value={value}
    max={max}
  ></progress>
);
