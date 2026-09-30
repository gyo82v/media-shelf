import SelectRoot, { useSelect } from "./Select.root";
import SelectTrigger from "./Select-trigger";
import SelectContent from "./Select-content";
import SelectItem from "./select.item";

export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Content: SelectContent,
  Item: SelectItem,
};

export { useSelect };
export default Select;