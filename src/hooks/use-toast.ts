<<<<<<< HEAD
"use client";

import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

// Constantes ajustadas para el juego
const LIMITE_TOASTS = 1; // Solo 1 toast visible (ideal para notificaciones críticas)
const RETRASO_ELIMINACION = 1_000_000; // 1 segundo = 1,000 ms (toasts persistentes)

type ToastJuego = ToastProps & {
  id: string;
  titulo?: React.ReactNode;
  descripcion?: React.ReactNode;
  accion?: ToastActionElement;
};

// Generador de IDs mejorado (usa crypto si está disponible)
function generarId() {
  return crypto.randomUUID?.() || Math.random().toString(36).slice(2, 9);
}

// Estado inicial y listeners
let estadoInicial: EstadoToast = { toasts: [] };
const listeners: Array<(state: EstadoToast) => void> = [];
const timeouts = new Map<string, ReturnType<typeof setTimeout>>();

// Reductor con seguridad de tipos
function reductor(state: EstadoToast, action: AccionToast): EstadoToast {
  switch (action.type) {
    case "AGREGAR_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, LIMITE_TOASTS),
      };

    case "ACTUALIZAR_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DESCARTAR_TOAST":
      if (action.toastId) {
        agregarAColaEliminacion(action.toastId);
      } else {
        state.toasts.forEach((t) => agregarAColaEliminacion(t.id));
      }
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toastId || action.toastId === undefined
            ? { ...t, open: false }
            : t
        ),
      };

    case "ELIMINAR_TOAST":
      return {
        ...state,
        toasts: action.toastId === undefined
          ? []
          : state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
}

// Dispatch para actualizar estado
function dispatch(action: AccionToast) {
  estadoInicial = reductor(estadoInicial, action);
  listeners.forEach((listener) => listener(estadoInicial));
}

// Función para manejar la eliminación retardada
function agregarAColaEliminacion(toastId: string) {
  if (timeouts.has(toastId)) return;

  const timeout = setTimeout(() => {
    timeouts.delete(toastId);
    dispatch({ type: "ELIMINAR_TOAST", toastId });
  }, RETRASO_ELIMINACION);

  timeouts.set(toastId, timeout);
}

// API Pública
export function toast({ ...props }: Omit<ToastJuego, "id">) {
  const id = generarId();

  const actualizar = (props: Partial<ToastJuego>) =>
    dispatch({ type: "ACTUALIZAR_TOAST", toast: { ...props, id } });

  const descartar = () => dispatch({ type: "DESCARTAR_TOAST", toastId: id });

  dispatch({
    type: "AGREGAR_TOAST",
=======
import * as React from 'react';

import type { ToastActionElement, ToastProps } from '@/components/ui/toast';

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType['ADD_TOAST'];
      toast: ToasterToast;
    }
  | {
      type: ActionType['UPDATE_TOAST'];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType['DISMISS_TOAST'];
      toastId?: ToasterToast['id'];
    }
  | {
      type: ActionType['REMOVE_TOAST'];
      toastId?: ToasterToast['id'];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: 'REMOVE_TOAST',
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };

    case 'DISMISS_TOAST': {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, 'id'>;

function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });

  dispatch({
    type: 'ADD_TOAST',
>>>>>>> 8405a82 (Actualización completa del juego STOP con nuevas funcionalidades)
    toast: {
      ...props,
      id,
      open: true,
<<<<<<< HEAD
      onOpenChange: (open) => !open && descartar(),
    },
  });

  return { id, descartar, actualizar };
}

// Hook para usar en componentes
export function useToast() {
  const [state, setState] = React.useState<EstadoToast>(estadoInicial);
=======
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);
>>>>>>> 8405a82 (Actualización completa del juego STOP con nuevas funcionalidades)

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
<<<<<<< HEAD
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);
=======
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);
>>>>>>> 8405a82 (Actualización completa del juego STOP con nuevas funcionalidades)

  return {
    ...state,
    toast,
<<<<<<< HEAD
    descartar: (toastId?: string) => dispatch({ type: "DESCARTAR_TOAST", toastId }),
  };
}

// Tipos
type AccionToast =
  | { type: "AGREGAR_TOAST"; toast: ToastJuego }
  | { type: "ACTUALIZAR_TOAST"; toast: Partial<ToastJuego> }
  | { type: "DESCARTAR_TOAST"; toastId?: string }
  | { type: "ELIMINAR_TOAST"; toastId?: string };

interface EstadoToast {
  toasts: ToastJuego[];
}
=======
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  };
}

export { useToast, toast };
>>>>>>> 8405a82 (Actualización completa del juego STOP con nuevas funcionalidades)
