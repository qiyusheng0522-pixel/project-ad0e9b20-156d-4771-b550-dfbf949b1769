import { ReactNode } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

interface ActionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * 统一的护士端底部弹出面板。
 * 所有二级操作(详情、表单、确认)都通过此组件呈现，保持交互一致性。
 */
const ActionSheet = ({ open, onOpenChange, title, description, children, footer }: ActionSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="mx-auto max-h-[85vh] max-w-[480px] overflow-hidden rounded-t-2xl border-t-0 p-0"
      >
        <div className="flex h-1 justify-center pt-2">
          <span className="h-1 w-10 rounded-full bg-muted-foreground/30" />
        </div>
        <SheetHeader className="px-5 pb-3 pt-4 text-left">
          <SheetTitle className="text-base">{title}</SheetTitle>
          {description && <SheetDescription className="text-xs">{description}</SheetDescription>}
        </SheetHeader>
        <div className="max-h-[60vh] overflow-y-auto px-5 pb-4">{children}</div>
        {footer && <div className="border-t bg-muted/20 px-5 py-3">{footer}</div>}
      </SheetContent>
    </Sheet>
  );
};

export default ActionSheet;
