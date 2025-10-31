import { usePathname, useRouter } from "next/navigation";
import {
  Plus,
  Loader2,
  EllipsisVertical,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface SidebarItem {
  name: string;
  icon: any;
  link: string;
}

export interface ChatSession {
  id: string;
  title: string;
  variant: keyof typeof chatVariantRouteMapping;
  updatedAt: string;
}
interface ToolButtonProps {
  item: SidebarItem;
  expanded: boolean;
}
interface NewChatButtonProps {
  onClick: () => void;
  loading: boolean;
  expanded: boolean;
}
interface ChatItemProps {
  chat: ChatSession;
  active: boolean;
  expanded: boolean;
  isEditing: boolean;
  editingValue: string;
  onEditValueChange: (value: string) => void;
  onStartRename: (id: string, title: string) => void;
  onCommitRename: () => void;
  onCancelRename: () => void;
  onDelete: (id: string) => void;
  confirmingRename?: boolean;
}

const chatVariantRouteMapping = {
  chat: '/chatbot/c/',
  notes_tool: '/chatbot/t/notes-tool/c/',
  youtube_tool: '/chatbot/t/youtube-video-tool/c/',
  diagram_tool: '/chatbot/t/diagrams-tool/c/',
  image_filter_tool: '/chatbot/t/image-filter-tool/c/',
};

export function ToolButton({ item, expanded }: ToolButtonProps) {
  const pathname = usePathname();
  const router = useRouter();
  const active = pathname === item.link;
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        router.push(item.link);
      }}
      className={`group relative flex items-center w-full rounded-lg px-2 py-2 text-sm transition-colors ${
        active
          ? "bg-indigo-500/20 text-white ring-1 ring-inset ring-indigo-500/50"
          : "text-neutral-300 hover:bg-white/10"
      }`}
      title={!expanded ? item.name : undefined}
    >
      <span
        className={`flex items-center justify-center shrink-0 w-7 h-7 rounded-md ${
          active
            ? "bg-indigo-500/30 text-indigo-300"
            : "bg-white/5 group-hover:bg-white/10"
        } ${!expanded ? "mx-auto" : ""}`}
      >
        {item.icon}
      </span>
      {expanded && (
        <span className="truncate ml-3 transition-all">{item.name}</span>
      )}
    </button>
  );
}

export function NewChatButton({
  onClick,
  loading,
  expanded,
}: NewChatButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      disabled={loading}
      className={`flex items-center justify-center rounded-md bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 disabled:opacity-60 transition ${
        expanded ? "w-8 h-8" : "w-8 h-8 mx-auto"
      }`}
      title="New Chat"
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Plus size={14} />
      )}
    </button>
  );
}

export function ChatItem({
  chat,
  active,
  expanded,
  isEditing,
  editingValue,
  onEditValueChange,
  onStartRename,
  onCommitRename,
  onCancelRename,
  onDelete,
  confirmingRename = false,
}: ChatItemProps) {
  const router = useRouter();
  if (!expanded) {
    return (
      <div className="group/chat relative flex justify-center px-1">
        <button
          onClick={() => router.push(`${chatVariantRouteMapping[chat.variant]}${chat.id}`)}
          className="w-full flex items-center justify-center"
        >
          <span
            className={`inline-block w-3 h-3 rounded-full transition-all ${
              active
                ? "bg-indigo-400 shadow-[0_0_0_3px_rgba(99,102,241,0.35)]"
                : "bg-neutral-500 hover:bg-neutral-400"
            } ${active ? "scale-110" : ""}`}
          />
        </button>
        <div className="absolute left-full ml-2 opacity-0 group-hover/chat:opacity-100 pointer-events-none z-50 bg-black/90 backdrop-blur-xl border border-white/10 rounded-md px-2 py-1 text-xs text-white whitespace-nowrap transition-opacity">
          {chat.title}
        </div>
      </div>
    );
  }
  return (
    <div
      className={`group relative w-full flex items-stretch gap-2 rounded-lg text-xs leading-snug transition-colors ${
        active
          ? "bg-indigo-500/20 ring-1 ring-inset ring-indigo-500/50 text-white"
          : "hover:bg-white/10 text-neutral-300"
      }`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!isEditing) router.push(`${chatVariantRouteMapping[chat.variant]}/${chat.id}`);
        }}
        className="flex items-center gap-2 flex-1 px-2 py-2 text-left"
      >
        <span
          className={`inline-block w-2 h-2 rounded-full self-center ${
            active
              ? "bg-indigo-400 shadow-[0_0_0_3px_rgba(99,102,241,0.25)]"
              : "bg-neutral-500 group-hover:bg-neutral-400"
          }`}
        />
        {!isEditing && (
          <span className="flex-1 truncate break-words">{chat.title}</span>
        )}
        {isEditing && (
          <input
            autoFocus
            value={editingValue}
            onChange={(e) => onEditValueChange(e.target.value)}
            onBlur={() => {
              if (!confirmingRename && editingValue.trim() === "")
                onCancelRename();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onCommitRename();
              }
              if (e.key === "Escape") onCancelRename();
            }}
            className="flex-1 bg-white/10 border border-indigo-400/40 rounded px-2 py-1 text-xs outline-none"
            placeholder="Rename chat"
          />
        )}
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            onClick={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition p-1.5 mr-1 my-1 rounded-md hover:bg-white/10 text-neutral-400 hover:text-neutral-200"
          >
            {isEditing ? (
              <X size={14} onClick={onCancelRename} />
            ) : (
              <EllipsisVertical size={14} />
            )}
          </button>
        </DropdownMenuTrigger>
        {!isEditing && (
          <DropdownMenuContent
            side="right"
            align="start"
            className="min-w-[140px] bg-black/80 backdrop-blur-xl border-white/10 text-white"
          >
            <DropdownMenuItem
              onClick={() => onStartRename(chat.id, chat.title)}
              className="cursor-pointer text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 focus:bg-blue-500/10 focus:text-blue-300 rounded-md px-2 py-1.5 flex items-center gap-2"
            >
              <Pencil size={14} className="text-blue-400" />
              <span className="text-sm">Rename</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(chat.id)}
              variant="destructive"
              className="cursor-pointer text-red-400 focus:text-red-400"
            >
              <Trash2 size={14} /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  );
}