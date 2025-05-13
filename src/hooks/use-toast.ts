
// Redirecionamento para o componente UI
import { toast as toastUI, useToast as useToastUI } from "@/components/ui/use-toast";
import type { ToastProps } from "@/components/ui/use-toast";

export type ToastProps = ToastProps;
export const useToast = useToastUI;
export const toast = toastUI;
