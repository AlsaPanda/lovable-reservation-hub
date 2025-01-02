import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface DeleteMenuItemProps {
  onDelete: () => void;
  isDisabled: boolean;
}

const DeleteMenuItem = ({ onDelete, isDisabled }: DeleteMenuItemProps) => {
  return (
    <DropdownMenuItem 
      onClick={() => !isDisabled && onDelete()}
      className="text-red-600 focus:text-red-600 cursor-pointer"
      disabled={isDisabled}
    >
      Supprimer le catalogue
    </DropdownMenuItem>
  );
};

export default DeleteMenuItem;