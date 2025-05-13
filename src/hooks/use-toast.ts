
// This file re-exports from the UI component for compatibility
import { useToast } from "@/components/ui/use-toast";
import { toast as uiToast } from "@/components/ui/use-toast";

export const toast = uiToast;
export { useToast };
