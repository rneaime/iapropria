
// Redirecionamento para o componente UI
import { toast as toastUI, useToast as useToastUI, type ToastProps } from "@/components/ui/use-toast";

export type { ToastProps };
export const useToast = useToastUI;
export const toast = toastUI;
