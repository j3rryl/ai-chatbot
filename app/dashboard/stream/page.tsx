"use client";

import { useUIState, useActions } from "ai/rsc";
import { AI } from "@/app/server-actions/prompt-action";
import InputPrompt from "@/components/forms/input-prompt";
import * as z from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Page() {
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>();
  const formSchema = z.object({
    prompt: z.string(),
  });
  type InputFormValue = z.infer<typeof formSchema>;

  const onSubmit = async (data: InputFormValue) => {
    // e.preventDefault();

    // Add user message to UI state
    setMessages((currentMessages: any) => [
      ...currentMessages,
      {
        id: Date.now(),
        display: <div>{data.prompt}</div>,
      },
    ]);

    // Submit and get response message
    const responseMessage = await submitUserMessage(data.prompt);
    setMessages((currentMessages: any) => [
      ...currentMessages,
      responseMessage,
    ]);
  };
  return (
    <>
      {/* {
        // View messages in UI state
        messages.map((message: any) => (
          <div key={message.id}>{message.display}</div>
        ))
      } */}
      <div className="flex flex-col h-full p-2 md:p-2 pt-6 gap-2">
        <ScrollArea className="flex-grow h-5/6">
          {messages?.map((message: any, index: number) => {
            return (
              <div
                key={index}
                className="flex justify-start gap-5 mb-5 items-start"
              >
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <p>AI Model</p>
                  <p>{message.display}</p>
                </div>
              </div>
            );
          })}
        </ScrollArea>
        <div>
          <InputPrompt onSubmit={onSubmit} />
        </div>
      </div>
    </>
  );
}
