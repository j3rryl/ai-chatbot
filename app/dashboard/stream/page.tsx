"use client";
import InputPrompt from "@/components/forms/input-prompt";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";

export async function* streamingFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  const response = await fetch(input, init);
  const reader = response!.body!.getReader();
  const decoder = new TextDecoder("utf-8");

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    try {
      yield decoder.decode(value);
    } catch (e: any) {
      console.warn(e.message);
    }
  }
}

export default function Page() {
  const [data, setData] = useState<any[]>([]);
  const controller = new AbortController();
  const signal = controller.signal;
  useEffect(() => {
    let isMounted = true;
    const asyncFetch = async () => {
      const it = streamingFetch(
        `${process.env.NEXT_PUBLIC_URL}/api/v1/stream`,
        { signal },
      );

      for await (let value of it) {
        try {
          const chunk = value;

          setData((prev) => [...prev, chunk]);
        } catch (e: any) {
          console.warn(e.message);
        }
      }
    };
    asyncFetch();
    return () => {
      isMounted = false;
      controller.abort;
    };
  }, []);
  return (
    <div className="flex flex-col h-full p-2 md:p-2 pt-6 gap-2">
      <ScrollArea className="flex-grow h-5/6">
        {data.map((chunk, index) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: chunk }} />
        ))}
      </ScrollArea>
      <div>
        <InputPrompt />
      </div>
    </div>
  );
}
