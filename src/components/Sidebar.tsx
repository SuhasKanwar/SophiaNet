"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Plus,
  ChevronsLeftRight,
  Clock,
  Search,
  Loader2,
  EllipsisVertical,
  Pencil,
  Trash2,
  X,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface SidebarItem {
  name: string;
  icon: any;
  link: string;
}
interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
}
type SidebarProps = {
  items: SidebarItem[];
  widthCollapsed?: number;
  widthExpanded?: number;
  className?: string;
};

export default function Sidebar({
  items,
  widthCollapsed = 60,
  widthExpanded = 250,
  className = "",
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState(true);
  const [loadingNew, setLoadingNew] = useState(false);
  const [search, setSearch] = useState("");
  const [navHeight, setNavHeight] = useState(56);
  const [chats, setChats] = useState<ChatSession[]>([
    {
      id: "c1",
      title: "Photosynthesis summary",
      updatedAt: "2025-08-29T10:05:00Z",
    },
    {
      id: "c2",
      title: "Lecture: Quantum gates",
      updatedAt: "2025-08-30T14:20:00Z",
    },
    { id: "c3", title: "OCR cleanup notes", updatedAt: "2025-08-31T09:12:00Z" },
    {
      id: "c4",
      title: "YouTube: CNN architectures",
      updatedAt: "2025-08-31T11:46:00Z",
    },
    {
      id: "c5",
      title: "Summarize: Web Scrape - LLM",
      updatedAt: "2025-08-28T18:33:00Z",
    },
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const currentWidth = expanded ? widthExpanded : widthCollapsed;
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      `${currentWidth}px`
    );
  }, [currentWidth]);
  useEffect(() => {
    const nav = document.querySelector("nav");
    if (nav) setNavHeight((nav as HTMLElement).offsetHeight || 56);
  }, []);

  const filteredChats = useMemo(
    () =>
      chats.filter((c) => c.title.toLowerCase().includes(search.toLowerCase())),
    [search, chats]
  );

  const handleNewChat = () => {
    setLoadingNew(true);
    const newId = `c${Date.now().toString(36)}`;
    const newChat: ChatSession = {
      id: newId,
      title: "New Chat",
      updatedAt: new Date().toISOString(),
    };
    setTimeout(() => {
      setChats((p) => [newChat, ...p]);
      setLoadingNew(false);
      setEditingId(newId);
      setEditingValue("New Chat");
      router.push(`/home?chat=${newId}`);
    }, 350);
  };
  const startRename = useCallback((id: string, title: string) => {
    setEditingId(id);
    setEditingValue(title);
  }, []);
  const commitRename = useCallback(() => {
    if (!editingId) return;
    setChats((p) =>
      p.map((c) =>
        c.id === editingId ? { ...c, title: editingValue || c.title } : c
      )
    );
    setEditingId(null);
    setEditingValue("");
  }, [editingId, editingValue]);
  const cancelRename = useCallback(() => {
    setEditingId(null);
    setEditingValue("");
  }, []);
  const deleteChat = useCallback(
    (id: string) => {
      setChats((p) => p.filter((c) => c.id !== id));
      if (pathname.includes(id)) router.push("/home");
    },
    [pathname, router]
  );

  return (
    <aside
      className={cn(
        "group/sidebar fixed left-0 bottom-0 border-r border-white/10 bg-black/70 backdrop-blur-xl flex flex-col overflow-hidden transition-[width] duration-300 ease-[cubic-bezier(.25,.4,.25,1)] cursor-pointer",
        className
      )}
      style={{ width: currentWidth, minWidth: currentWidth, top: navHeight }}
      onClick={() => {
        if (!expanded) setExpanded(true);
      }}
    >
      {/* Header with logo & toggle */}
      <div className="relative flex items-center justify-start gap-2 px-3 pt-3 pb-2 border-b border-white/10 select-none">
        <div className="relative w-9 h-9">
          <Image
            src="/logo.png"
            alt="SophiaNet Logo"
            fill
            sizes="36px"
            priority
            className={cn(
              "object-contain rounded-md transition-opacity duration-200",
              !expanded && "group-hover/sidebar:opacity-0"
            )}
          />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((prev) => !prev);
          }}
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition",
            // centered when collapsed
            !expanded ? "mx-auto" : "ml-auto"
          )}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          title={expanded ? "Collapse" : "Expand"}
        >
          <ChevronsLeftRight
            size={16}
            className={cn("transition-transform", expanded && "rotate-180")}
          />
        </button>
      </div>

      {/* Tools (always visible; labels hidden when collapsed) */}
      <div className="px-2 pt-2">
        <p
          className={cn(
            "px-2 mb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 transition-opacity",
            !expanded && "opacity-0 pointer-events-none"
          )}
        >
          Tools
        </p>
        <nav className="flex flex-col gap-1" aria-label="Primary tools">
          {items.map((item) => {
            const active = pathname === item.link;
            return (
              <button
                key={item.link}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(item.link);
                }}
                className={cn(
                  "group relative flex items-center w-full rounded-lg px-2 py-2 text-sm transition-colors",
                  active
                    ? "bg-indigo-500/20 text-white ring-1 ring-inset ring-indigo-500/50"
                    : "text-neutral-300 hover:bg-white/10"
                )}
                aria-label={item.name}
              >
                <span
                  className={cn(
                    "flex items-center justify-center shrink-0 w-7 h-7 rounded-md",
                    active
                      ? "bg-indigo-500/30 text-indigo-300"
                      : "bg-white/5 group-hover:bg-white/10"
                  )}
                >
                  {item.icon}
                </span>
                <span
                  className={cn(
                    "truncate ml-3 transition-all",
                    !expanded &&
                      "opacity-0 -translate-x-2 w-0 ml-0 pointer-events-none"
                  )}
                >
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Collapsed quick chat area */}
      {!expanded && (
        <div
          className="flex-1 flex flex-col items-center py-3 gap-3 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handleNewChat()}
            disabled={loadingNew}
            className="flex items-center justify-center w-9 h-9 rounded-md bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 disabled:opacity-60 transition"
            title="New Chat"
          >
            {loadingNew ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus size={16} />
            )}
          </button>
          <div className="flex-1 w-full overflow-y-auto px-2 space-y-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {chats.map((chat) => {
              const active = pathname.includes(chat.id);
              return (
                <button
                  key={chat.id}
                  onClick={() => router.push(`/home?chat=${chat.id}`)}
                  title={chat.title}
                  className={cn(
                    "w-full flex items-center justify-center",
                    active && "scale-110"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block w-3 h-3 rounded-full transition-all",
                      active
                        ? "bg-indigo-400 shadow-[0_0_0_3px_rgba(99,102,241,0.35)]"
                        : "bg-neutral-500 hover:bg-neutral-400"
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Expanded full chat/history + footer */}
      {expanded && (
        <>
          <div className="mt-4 mb-3 mx-3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="flex-1 min-h-0 px-2 pb-2 flex flex-col">
            <div className="flex items-center gap-2 px-2 mb-3">
              <Clock size={14} className="text-neutral-400" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                Chat History
              </p>
            </div>
            <div className="px-1 mb-3 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNewChat();
                }}
                disabled={loadingNew}
                className="flex items-center justify-center w-8 h-8 rounded-md bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 disabled:opacity-60 transition"
                title="New Chat"
              >
                {loadingNew ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Plus size={16} />
                )}
              </button>
              <div
                className="relative flex-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Search
                  size={14}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full text-xs rounded-md bg-white/5 border border-white/10 focus:border-indigo-400/50 outline-none pl-7 pr-2 py-1.5 placeholder:text-neutral-500"
                />
              </div>
            </div>
            <div
              className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              {filteredChats.length === 0 && (
                <p className="text-neutral-500 text-xs px-2 py-4 text-center">
                  {search ? "No matches" : "No chats yet"}
                </p>
              )}
              {filteredChats.map((chat) => {
                const active = pathname.includes(chat.id);
                const isEditing = editingId === chat.id;
                return (
                  <div
                    key={chat.id}
                    className={cn(
                      "group relative w-full flex items-stretch gap-2 rounded-lg text-xs leading-snug transition-colors",
                      active
                        ? "bg-indigo-500/20 ring-1 ring-inset ring-indigo-500/50 text-white"
                        : "hover:bg-white/10 text-neutral-300"
                    )}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isEditing) router.push(`/home?chat=${chat.id}`);
                      }}
                      className="flex items-center gap-2 flex-1 px-2 py-2 text-left"
                      disabled={isEditing}
                    >
                      <span
                        className={cn(
                          "inline-block w-2 h-2 rounded-full self-center",
                          active
                            ? "bg-indigo-400 shadow-[0_0_0_3px_rgba(99,102,241,0.25)]"
                            : "bg-neutral-500 group-hover:bg-neutral-400"
                        )}
                      />
                      {!isEditing && (
                        <span className="flex-1 truncate">{chat.title}</span>
                      )}
                      {isEditing && (
                        <input
                          autoFocus
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onBlur={commitRename}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitRename();
                            if (e.key === "Escape") cancelRename();
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
                          aria-label="Chat actions"
                        >
                          {isEditing ? (
                            <X
                              size={14}
                              onClick={(e) => {
                                e.stopPropagation();
                                cancelRename();
                              }}
                            />
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
                            onClick={() => startRename(chat.id, chat.title)}
                            className="cursor-pointer text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 focus:bg-blue-500/10 focus:text-blue-300 rounded-md px-2 py-1.5 flex items-center gap-2"
                          >
                            <Pencil size={14} className="text-blue-400" />
                            <span className="text-sm">Rename</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => deleteChat(chat.id)}
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
              })}
            </div>
          </div>
          <div
            className="p-3 border-t border-white/10 flex flex-col gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600/40 to-purple-600/40 border border-white/15 flex items-center justify-center text-[11px] font-semibold text-indigo-100">
                SK
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">Suhas Kanwar</p>
                <p className="text-[10px] text-neutral-500 truncate">
                  Free Tier • {chats.length} chats
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/settings");
                }}
                className="p-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition"
                title="Settings"
              >
                <Settings size={14} />
              </button>
            </div>
            <div className="text-[10px] text-neutral-500 flex items-center justify-between">
              <span>v0.1.0</span>
              <span
                className="text-indigo-400/70 cursor-pointer hover:text-indigo-300"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/upgrade");
                }}
              >
                Upgrade
              </span>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}