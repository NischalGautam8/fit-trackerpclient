"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, X } from "lucide-react";

interface Message {
  text: string;
  sender: "user" | "agent";
  eventType?: "thought" | "action" | "action_input" | "observation" | "final";
  data?: unknown;
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<string>("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const agentIndexRef = useRef<number | null>(null);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    
    const updatedChatHistory = chatHistory + (chatHistory ? "\n" : "") + `User: ${input}`;
    setChatHistory(updatedChatHistory);

    setInput("");
    setIsLoading(true);

    // Clear any prior placeholder indexing
    agentIndexRef.current = null;

    try {
      const response = await fetch("http://localhost:5001/agent?stream=true", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({ input, chat_history: updatedChatHistory }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Streaming response not available");
      }

      const decoder = new TextDecoder();
      const reader = response.body.getReader();
      let buffer = "";

      const appendMessage = (message: Message) => {
        setMessages((prev) => [...prev, message]);
      };

      const handleEvent = (eventName: string, data: string) => {
        switch (eventName) {
          case "thought":
            appendMessage({ sender: "agent", text: data || "", eventType: "thought" });
            setChatHistory((prev) => prev + (prev ? "\n" : "") + `Agent (thought): ${data || ""}`);
            break;
          case "action":
            try {
              const { name } = JSON.parse(data || "{}");
              appendMessage({ sender: "agent", text: `Action: ${name}`, eventType: "action" });
              setChatHistory((prev) => prev + (prev ? "\n" : "") + `Agent (action): ${name}`);
            } catch (_) {}
            break;
          case "action_input":
            try {
              const payload = JSON.parse(data || "{}");
              appendMessage({ sender: "agent", text: JSON.stringify(payload, null, 2), eventType: "action_input", data: payload });
              setChatHistory((prev) => prev + (prev ? "\n" : "") + `Agent (action_input): ${JSON.stringify(payload)}`);
            } catch (_) {}
            break;
          case "observation":
            appendMessage({ sender: "agent", text: data || "", eventType: "observation" });
            setChatHistory((prev) => prev + (prev ? "\n" : "") + `Agent (observation): ${data || ""}`);
            break;
          case "final_answer": {
            const finalText = data || "";
            appendMessage({ sender: "agent", text: finalText, eventType: "final" });
            setChatHistory((prev) => prev + (prev ? "\n" : "") + `Agent: ${finalText}`);
            break;
          }
          case "error":
            console.error("SSE error event", data);
            break;
          case "done":
            setIsLoading(false);
            break;
          default:
            break;
        }
      };

      // Read and parse SSE frames
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // Process complete events separated by double newlines
        let sepIndex;
        while ((sepIndex = buffer.indexOf("\n\n")) !== -1) {
          const rawEvent = buffer.slice(0, sepIndex);
          buffer = buffer.slice(sepIndex + 2);

          const lines = rawEvent.split(/\r?\n/);
          let eventName = "message";
          const dataLines: string[] = [];
          for (const line of lines) {
            if (line.startsWith("event:")) {
              eventName = line.slice(6).trim();
            } else if (line.startsWith("data:")) {
              dataLines.push(line.slice(5).trimStart());
            }
          }
          const data = dataLines.join("\n");
          handleEvent(eventName, data);
        }
      }

      // Flush any remaining buffered event
      if (buffer.trim()) {
        const lines = buffer.split(/\r?\n/);
        let eventName = "message";
        const dataLines: string[] = [];
        for (const line of lines) {
          if (line.startsWith("event:")) {
            eventName = line.slice(6).trim();
          } else if (line.startsWith("data:")) {
            dataLines.push(line.slice(5).trimStart());
          }
        }
        const data = dataLines.join("\n");
        handleEvent(eventName, data);
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Failed to start POST-based streaming:", err);
      setIsLoading(false);
      const errorMessage: Message = { text: "Unable to start stream.", sender: "agent" };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleTemplateClick = (template: string) => {
    setInput(template);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      // nothing to cleanup for fetch reader
    };
  }, []);

  const templateMessages = [
    "create post for all of my activities",
    "delete all of my activities",
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        className="rounded-full w-14 h-14 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <Card className="w-[350px] h-[500px] flex flex-col absolute bottom-16 right-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Chat with Agent</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col p-4 overflow-hidden">
            <ScrollArea className="flex-grow min-h-0 p-2 border rounded-lg mb-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-xl ${
                        msg.sender === "user"
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-bl-none"
                      }`}
                    >
                      {msg.eventType === "thought" ? (
                        <details>
                          <summary className="cursor-pointer select-none opacity-80">Thought</summary>
                          <pre className="whitespace-pre-wrap break-words mt-2 text-sm">{msg.text}</pre>
                        </details>
                      ) : msg.eventType === "action" ? (
                        <div>
                          <span className="font-semibold">Action</span>
                          <div className="mt-1 text-sm">{msg.text}</div>
                        </div>
                      ) : msg.eventType === "action_input" ? (
                        <div>
                          <span className="font-semibold">Action Input</span>
                          <pre className="whitespace-pre-wrap break-words mt-1 text-xs">{msg.text}</pre>
                        </div>
                      ) : msg.eventType === "observation" ? (
                        <div>
                          <span className="font-semibold">Observation</span>
                          <div className="mt-1 text-sm whitespace-pre-wrap break-words">{msg.text}</div>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap break-words">{msg.text}</div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[70%] px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-bl-none">
                      <div className="flex items-center space-x-1">
                        <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="mb-4 flex flex-wrap gap-2">
              {templateMessages.map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleTemplateClick(template)}
                  className="text-xs h-auto py-1"
                >
                  {template}
                </Button>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} disabled={isLoading}>
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChatWidget;
