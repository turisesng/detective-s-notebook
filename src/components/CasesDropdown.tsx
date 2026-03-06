import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { fetchCases, type Case as RemoteCase } from '@/lib/caseService';

const CasesDropdown = ({
  onSelect,
  selectedId,
}: {
  onSelect?: (c: RemoteCase | null) => void;
  selectedId?: string | null;
}) => {
  const [cases, setCases] = useState<RemoteCase[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchCases()
      .then((data) => {
        if (!mounted) return;
        setCases(data);
        console.log(`✓ Loaded ${data.length} cases from Supabase:`, data.map((c) => ({ id: c.id, title: c.title })));
      })
      .catch((e: any) => {
        console.error('Failed to load cases:', e);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const label = cases.find((c) => c.id === selectedId)?.title ?? 'Load Case';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 hover:bg-primary/20 transition text-primary font-medium text-sm">
          {label}
          <ChevronDown className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64">
        {loading && <DropdownMenuItem disabled>Loading...</DropdownMenuItem>}
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
