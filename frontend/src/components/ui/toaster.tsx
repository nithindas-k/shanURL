import { useToast } from '../../hooks/use-toast';
import { X } from 'lucide-react';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map(({ id, title, description, variant }) => (
        <div
          key={id}
          className={`group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all duration-300 mb-2 ${
            variant === 'destructive'
              ? 'destructive group border-destructive bg-destructive text-destructive-foreground'
              : 'border-border bg-background text-foreground'
          }`}
        >
          <div className="grid gap-1">
            {title && <div className="text-sm font-semibold">{title}</div>}
            {description && (
              <div className="text-xs opacity-90">{description}</div>
            )}
          </div>
          <button
            onClick={() => id && dismiss(id)}
            className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
