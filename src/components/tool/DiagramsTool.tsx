"use client";

import DottedPattern from "../ui/dotted-pattern";
import ToolsHeading from "./ToolsHeading";
import { useState } from "react";
import ChatInputComponent from "@/components/chat/ChatInputComponent";
import axios from "axios";
import { MICROSERVICE_BASE_URL } from "@/lib/config";
import { useToast } from "@/providers/ToastProvider";

export default function DiagramsTool() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [diagram, setDiagram] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setError(null);
    setDiagram(null);

    try {
      const res = await axios.post(`${MICROSERVICE_BASE_URL}/generate-diagram`, {
        prompt: input.trim(),
      });
      if (res.data?.status !== 200) {
        throw new Error(res.data?.message || "Failed to generate diagram");
      }
      const text: string = res.data?.response || "No diagram generated.";
      setDiagram(text);

      showToast({
        type: "success",
        title: "Diagram Generated",
        message: "Your diagram has been generated successfully.",
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

      <div className="flex-1 flex items-center justify-center w-full max-w-3xl mx-auto">
        {diagram ? (
          <pre className="whitespace-pre-wrap text-sm text-neutral-100 bg-black/50 border border-white/10 rounded-xl p-4 max-w-full max-h-[60vh] overflow-auto text-center">
            {diagram}
          </pre>
        ) : (
          <p className="text-sm text-neutral-400 text-center px-4">
            Enter a description below to generate a diagram. For now, a dummy text
            diagram will be rendered here in the center.
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
        placeholder="Describe the diagram you want to generate..."
        showFileUpload={false}
        showVoiceInput={false}
        onError={setError}
        bottomText="Diagrams Tool – powered by SophiaNet"
      />
    </section>
  );
}