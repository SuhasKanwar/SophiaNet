import axios from "axios";

export enum conversationVariant {
    CHAT = "chat",
    NOTES_TOOL = "notes_tool",
    YOUTUBE_TOOL = "youtube_tool",
    DIAGRAM_TOOL = "diagram_tool",
    IMAGE_FILTER_TOOL = "image_filter_tool"
}

export const createConversation = async (title: string, variant: conversationVariant) => {
    const res = await axios.post("/api/conversation", { title, variant });
    if (!res.data.success)
      throw new Error(res.data.message || "Failed to create conversation");
    return res.data.data;
  };