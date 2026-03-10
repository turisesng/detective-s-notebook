import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import type { Case as RemoteCase } from '@/lib/caseService';

const CasesDropdown = ({
  onSelect,
  selectedId,
  cases, // Accept cases as a prop
}: {
  onSelect?: (c: RemoteCase | null) => void;
  selectedId?: string | null;
  cases: RemoteCase[];
}) => {
  const label = cases.find((c) => c.id === selectedId)?.title ?? 'Select Case';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 hover:bg-primary/20 transition text-primary font-medium text-sm">
          {label}
          <ChevronDown className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 max-h-96 overflow-y-auto">
        {cases.length === 0 && <DropdownMenuItem disabled>No cases found</DropdownMenuItem>}
        {cases.map((c) => (
          <DropdownMenuItem
            key={c.id}
            onSelect={() => onSelect?.(c)}
            className={selectedId === c.id ? 'font-semibold bg-primary/10' : ''}
          >
            <span className="truncate">{c.title}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CasesDropdown;