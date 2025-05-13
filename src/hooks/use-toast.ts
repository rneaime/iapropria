
// Redirecionamento para o componente UI
import { toast as toastUI, useToast as useToastUI } from "@/components/ui/use-toast";
import type { ToastProps as ToastPropsUI } from "@/components/ui/toast";

export type ToastProps = ToastPropsUI;
export const useToast = useToastUI;
export const toast = toastUI;
