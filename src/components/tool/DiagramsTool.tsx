"use client";

import DottedPattern from "../ui/dotted-pattern";
import ToolsHeading from "./ToolsHeading";
import { useState } from "react";
import ChatInputComponent from "@/components/chat/ChatInputComponent";
import axios from "axios";
import { MICROSERVICE_BASE_URL } from "@/lib/config";
import { useToast } from "@/providers/ToastProvider";
import MermaidChart from "@/components/MermaidChart";

export default function DiagramsTool() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [diagram, setDiagram] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const [currentCode, setCurrentCode] = useState<string>("");

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${MICROSERVICE_BASE_URL}/generate-diagram`, {
        prompt: input.trim(),
        code: currentCode,
      });
      if (res.data?.status !== 200) {
        throw new Error(res.data?.message || "Failed to generate diagram");
      }
      const mermaidCode: string = res.data?.response || "";
      if (!mermaidCode.trim()) {
        throw new Error("Empty diagram code received from backend.");
      }

      setDiagram(mermaidCode);
      setCurrentCode(mermaidCode);
      setInput("");

      showToast({
        type: "success",
        title: "Diagram Generated",
        message: "Your Mermaid diagram has been generated successfully.",
      });
    } catch (e: any) {
      const msg =
        e?.response?.data?.message || e?.message || "Failed to generate diagram";
      setError(msg);
      showToast({
        type: "error",
        title: "Diagram Error",
        message: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="flex flex-col w-full px-3 pt-4 items-center mt-[var(--navbar-height,64px)]"
      style={{ minHeight: "calc(100vh - var(--navbar-height,64px))" }}
    >
      <ToolsHeading firstPart="Diagrams" secondPart="Tool" />
      <DottedPattern />

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto gap-4">
        {diagram ? (
          <div className="w-full overflow-auto">
            <MermaidChart code={diagram} />
          </div>
        ) : (
          <p className="text-sm text-neutral-400 text-center px-4 max-w-xl">
            Describe the diagram you want below. The backend will generate
            Mermaid code, and the diagram will be rendered here. You can also
            modify the Mermaid code in the editor and ask the tool to refine it.
          </p>
        )}
      </div>

      {error && (
        <div className="mb-2 text-xs text-red-400 text-center max-w-xl">
          {error}
        </div>
      )}

      <ChatInputComponent
        input={input}
        setInput={setInput}
        onSend={handleSend}
        loading={loading}
        placeholder="Describe or refine the diagram you want to generate..."
        showFileUpload={false}
        showVoiceInput={false}
        onError={setError}
        bottomText="Diagrams Tool – natural language + Mermaid code refinement"
      />
    </section>
  );
}