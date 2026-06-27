import { useState, useEffect } from 'react';

export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

type Listener = (toasts: ToastProps[]) => void;
let memoryToasts: ToastProps[] = [];
let listeners: Listener[] = [];

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const dispatch = (action: { type: 'ADD' | 'REMOVE'; toast?: ToastProps; id?: string }) => {
  if (action.type === 'ADD' && action.toast) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...action.toast, id };
    memoryToasts = [...memoryToasts, newToast];

    const timeout = setTimeout(() => {
      dispatch({ type: 'REMOVE', id });
    }, action.toast.duration || 3000);

    toastTimeouts.set(id, timeout);
  } else if (action.type === 'REMOVE' && action.id) {
    memoryToasts = memoryToasts.filter((t) => t.id !== action.id);
    const timeout = toastTimeouts.get(action.id);
    if (timeout) {
      clearTimeout(timeout);
      toastTimeouts.delete(action.id);
    }
  }

  listeners.forEach((listener) => listener(memoryToasts));
};

export const toast = (props: ToastProps) => {
  dispatch({ type: 'ADD', toast: props });
};

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>(memoryToasts);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter((l) => l !== setToasts);
    };
  }, []);

  return {
    toasts,
    toast,
    dismiss: (id: string) => dispatch({ type: 'REMOVE', id }),
  };
};
