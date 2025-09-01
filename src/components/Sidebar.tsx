"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  ChevronsLeftRight,
  Clock,
  Search,
} from "lucide-react";
import Image from "next/image";
import { ToolButton, NewChatButton, ChatItem } from "./SidebarComponents";

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
  const [chats, setChats] = useState<ChatSession[]>([
    { id: "c1", title: "Photosynthesis summary", updatedAt: "2025-08-29T10:05:00Z" },
    { id: "c2", title: "Lecture: Quantum gates", updatedAt: "2025-08-30T14:20:00Z" },
    { id: "c3", title: "OCR cleanup notes", updatedAt: "2025-08-31T09:12:00Z" },
    { id: "c4", title: "YouTube: CNN architectures", updatedAt: "2025-08-31T11:46:00Z" },
    { id: "c5", title: "Summarize: Web Scrape - LLM", updatedAt: "2025-08-28T18:33:00Z" },
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const currentWidth = expanded ? widthExpanded : widthCollapsed;
  
  useEffect(() => {
    document.documentElement.style.setProperty("--sidebar-width", `${currentWidth}px`);
    const nav = document.querySelector("nav");
    if (nav) {
      const navHeight = nav.offsetHeight || 56;
      document.documentElement.style.setProperty("--nav-height", `${navHeight}px`);
    }
  }, [currentWidth]);

  const filteredChats = useMemo(
    () => chats.filter((c) => c.title.toLowerCase().includes(search.toLowerCase())),
    [search, chats]
  );

  const handleNewChat = () => {
    // TODO: Implement API call to create new chat
    // TODO: Add proper routing logic
    console.log("New chat clicked");
  };

  const startRename = useCallback((id: string, title: string) => {
    // TODO: Implement rename functionality
    console.log("Start rename:", id, title);
  }, []);

  const commitRename = useCallback(() => {
    // TODO: Implement commit rename API call
    console.log("Commit rename");
  }, []);

  const cancelRename = useCallback(() => {
    // TODO: Implement cancel rename logic
    console.log("Cancel rename");
  }, []);

  const deleteChat = useCallback(
    (id: string) => {
      // TODO: Implement delete API call
      // TODO: Add proper routing after delete
      console.log("Delete chat:", id);
    },
    []
  );

  return (
    <aside
      className={`group/sidebar fixed left-0 bottom-0 border-r border-white/10 bg-black/70 backdrop-blur-xl flex flex-col overflow-hidden transition-[width] duration-300 ease-[cubic-bezier(.25,.4,.25,1)] ${!expanded ? 'cursor-col-resize hover:cursor-col-resize' : 'cursor-pointer'} ${className}`}
      style={{ 
        width: currentWidth, 
        minWidth: currentWidth, 
        top: 'var(--nav-height, 56px)' 
      }}
      onClick={() => !expanded && setExpanded(true)}
    >
      <div className={`relative flex items-center justify-center gap-2 border-b border-white/10 select-none ${expanded ? 'px-3 pt-3 pb-2' : 'px-2 py-3'}`}>
        {!expanded ? (
          <div className="relative w-8 h-8 group/logo">
            <Image
              src="/logo.png"
              alt="SophiaNet Logo"
              fill
              sizes="32px"
              priority
              className="object-contain rounded-md transition-opacity group-hover/logo:opacity-0"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(true);
              }}
              className="absolute inset-0 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center w-full h-full rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-all"
              title="Expand"
            >
              <ChevronsLeftRight size={14} />
            </button>
          </div>
        ) : (
          <>
            <div className="relative w-9 h-9">
              <Image
                src="/logo.png"
                alt="SophiaNet Logo"
                fill
                sizes="36px"
                priority
                className="object-contain rounded-md"
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(false);
              }}
              className="flex items-center justify-center w-8 h-8 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition ml-auto"
              title="Collapse"
            >
              <ChevronsLeftRight size={16} className="transition-transform rotate-180" />
            </button>
          </>
        )}
      </div>

      <div className="px-2 pt-2">
        {expanded && (
          <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 transition-opacity">
            Tools
          </p>
        )}
        <nav className="flex flex-col gap-1">
          {items.map((item) => (
            <ToolButton key={item.link} item={item} expanded={expanded} />
          ))}
        </nav>
      </div>

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
              <NewChatButton onClick={handleNewChat} loading={loadingNew} expanded={expanded} />
              <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
                <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full text-xs rounded-md bg-white/5 border border-white/10 focus:border-indigo-400/50 outline-none pl-7 pr-2 py-1.5 placeholder:text-neutral-500"
                />
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent" onClick={(e) => e.stopPropagation()}>
              {filteredChats.length === 0 && (
                <p className="text-neutral-500 text-xs px-2 py-4 text-center">
                  {search ? "No matches" : "No chats yet"}
                </p>
              )}
              {filteredChats.map((chat) => {
                const active = pathname.includes(chat.id);
                const isEditing = editingId === chat.id;
                return (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    active={active}
                    expanded={expanded}
                    isEditing={isEditing}
                    editingValue={editingValue}
                    onEditValueChange={setEditingValue}
                    onStartRename={startRename}
                    onCommitRename={commitRename}
                    onCancelRename={cancelRename}
                    onDelete={deleteChat}
                  />
                );
              })}
            </div>
          </div>
          
          <div className="p-3 border-t border-white/10 text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-xs font-medium text-white mb-1">SophiaNet</p>
            <p className="text-[10px] text-neutral-400">© 2025 All rights reserved</p>
          </div>
        </>
      )}

      {!expanded && (
        <div className="flex-1 flex flex-col items-center py-2 gap-6 mt-2 overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <NewChatButton onClick={handleNewChat} loading={loadingNew} expanded={expanded} />
          <div className="flex-1 w-full overflow-y-auto overflow-x-hidden px-1 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {chats.map((chat) => {
              const active = pathname.includes(chat.id);
              return (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  active={active}
                  expanded={expanded}
                  isEditing={false}
                  editingValue=""
                  onEditValueChange={() => {}}
                  onStartRename={() => {}}
                  onCommitRename={() => {}}
                  onCancelRename={() => {}}
                  onDelete={() => {}}
                />
              );
            })}
          </div>
          <div className="border-t border-white/10 pt-2">
            <p className="text-[8px] text-neutral-500 writing-mode-vertical text-center" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }} title="SophiaNet © 2025">
              SN
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}