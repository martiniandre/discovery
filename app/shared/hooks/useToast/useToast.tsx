import { useState } from "react";
import { createPortal } from "react-dom";

type ToastPositions =
  | "top"
  | "top-right"
  | "top-left"
  | "bottom"
  | "bottom-right"
  | "bottom-left"
  | "center";

type ToastStatus = "success" | "warning" | "info" | "error" | "loading";

export interface ToastOptionsProps {
  status?: ToastStatus;
  position?: ToastPositions;
  description?: string;
  isClosable?: boolean;
  title?: string;
  duration?: number;
}

type Toast = ToastOptionsProps & { id: number };

export function useToast() {
  const [toasts, setToasts] = useState<Array<Toast>>([]);

  function closeToast(toastID: number) {
    setToasts((oldToasts) => oldToasts.filter((toast) => toast.id !== toastID));
  }

  function isActive(toastID: number) {
    return toasts.length > 9 && toasts.some((toast) => toast.id === toastID);
  }

  function addToast(options?: ToastOptionsProps) {
    const toast: Toast = {
      id: Date.now(),
      status: "success",
      title: "",
      position: "top-right",
      description: "",
      isClosable: false,
      duration: 5000,
      ...options,
    };

    setToasts((oldToasts) => [...oldToasts, toast]);

    setTimeout(() => {
      closeToast(toast.id);
    }, toast.duration);

    return toast.id;
  }

  const ToastComponent = () => {
    return toasts.map((toast, index) =>
      createPortal(
        <div
          key={toast.id}
          className={`toast min-w-[230px] rounded-md shadow-lg`}
          data-status={toast.status}
          data-position={toast.position}
          style={{ "--index": index + 1 } as React.CSSProperties}
        >
          <div className="py-3 px-4">
            {toast.title ? <h3 className="text-sm">{toast.title}</h3> : null}
            {toast.description ? (
              <p className="text-xs">{toast.description}</p>
            ) : null}
            {toast.isClosable ? (
              <button
                onClick={() => closeToast(toast.id)}
                className="absolute top-1 right-3 text-sm"
              >
                X
              </button>
            ) : null}
          </div>
          <div
            className="h-[5px] progress-bar bg-white"
            style={
              { "--duration": `${toast.duration}ms` } as React.CSSProperties
            }
          />
        </div>,
        document.body
      )
    );
  };

  return {
    addToast,
    ToastComponent,
    isActive,
  };
}
