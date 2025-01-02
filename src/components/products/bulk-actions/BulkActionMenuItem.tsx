import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LucideIcon } from "lucide-react";

interface BulkActionMenuItemProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  className?: string;
}

const BulkActionMenuItem = ({ icon: Icon, label, onClick, className }: BulkActionMenuItemProps) => {
  return (
    <DropdownMenuItem onClick={onClick} className={`cursor-pointer ${className}`}>
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </DropdownMenuItem>
  );
};

export default BulkActionMenuItem;