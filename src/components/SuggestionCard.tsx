interface SuggestionCardProps {
  title: string;
  desc: string;
  question: string;
  onSelect: (q: string) => void;
}

export default function SuggestionCard({ title, desc, question, onSelect }: SuggestionCardProps) {
  return (
    <button
      onClick={() => onSelect(question)}
      className="group relative rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 p-4 text-left transition flex flex-col gap-2"
    >
      <span className="font-medium text-sm text-white/90">{title}</span>
      <span className="text-[11px] leading-snug text-neutral-400 line-clamp-3">{desc}</span>
      <span className="text-[10px] text-indigo-300/70 mt-auto opacity-0 group-hover:opacity-100 transition">
        Click to use
      </span>
    </button>
  );
}