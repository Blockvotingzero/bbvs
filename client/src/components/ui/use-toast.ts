
import React from "react";

const TOAST_LIMIT = 20;
const TOAST_REMOVE_DELAY = 1000;

type ToastActionElement = React.ReactElement;

export type Toast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: Omit<Toast, "id">;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<Omit<Toast, "id">> & Pick<Toast, "id">;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: string;
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: string;
    };

interface State {
  toasts: Toast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [
          { id: genId(), ...action.toast, open: true, onOpenChange: () => {} },
          ...state.toasts,
        ].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.map((t) =>
            t.id === toastId ? { ...t, open: false } : t
          ),
        };
      }

      return {
        ...state,
        toasts: state.toasts.map((t) => ({ ...t, open: false })),
      };
    }

    case "REMOVE_TOAST": {
      const { toastId } = action;

      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.filter((t) => t.id !== toastId),
        };
      }

      return {
        ...state,
        toasts: [],
      };
    }
  }
};

const ToastContext = React.createContext<{
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id" | "open" | "onOpenChange">) => void;
  updateToast: (
    toast: Partial<Omit<Toast, "id">> & Pick<Toast, "id">
  ) => void;
  dismissToast: (toastId?: string) => void;
  removeToast: (toastId?: string) => void;
}>({
  toasts: [],
  addToast: () => {},
  updateToast: () => {},
  dismissToast: () => {},
  removeToast: () => {},
});

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(reducer, { toasts: [] });

  React.useEffect(() => {
    state.toasts.forEach((toast) => {
      if (!toast.open && !toastTimeouts.has(toast.id)) {
        const timeout = setTimeout(() => {
          toastTimeouts.delete(toast.id);
          dispatch({ type: "REMOVE_TOAST", toastId: toast.id });
        }, TOAST_REMOVE_DELAY);

        toastTimeouts.set(toast.id, timeout);
      }
    });
  }, [state.toasts]);

  const addToast = React.useCallback(
    (toast: Omit<Toast, "id" | "open" | "onOpenChange">) => {
      dispatch({ type: "ADD_TOAST", toast });
    },
    [dispatch]
  );

  const updateToast = React.useCallback(
    (toast: Partial<Omit<Toast, "id">> & Pick<Toast, "id">) => {
      dispatch({ type: "UPDATE_TOAST", toast });
    },
    [dispatch]
  );

  const dismissToast = React.useCallback(
    (toastId?: string) => {
      dispatch({ type: "DISMISS_TOAST", toastId });
    },
    [dispatch]
  );

  const removeToast = React.useCallback(
    (toastId?: string) => {
      dispatch({ type: "REMOVE_TOAST", toastId });
    },
    [dispatch]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts: state.toasts,
        addToast,
        updateToast,
        dismissToast,
        removeToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return {
    ...context,
    toast: (props: Omit<Toast, "id" | "open" | "onOpenChange">) => {
      context.addToast(props);
    },
  };
};
