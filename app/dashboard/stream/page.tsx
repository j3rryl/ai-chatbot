import { createAI, getMutableAIState, render } from "ai/rsc";
import { OpenAI } from "openai";

import StreamPrompt from "@/components/forms/stream-prompt";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import * as z from "zod";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export async function* streamingFetch(
  input: RequestInfo | URL,
  bodyData?: any,
  init?: RequestInit,
) {
  const response = await fetch(input, {
    ...init,
    method: "POST",
    body: JSON.stringify(bodyData),
    headers: {
      "Content-Type": "application/json",
    },
  });
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

function MyCard() {
  return (
    <Card>
      <div>Card 1</div>
    </Card>
  );
}
function Spinner() {
  return <div>Loading...</div>;
}
export default function Page() {
  //   const [data, setData] = useState<any[]>([]);
  const controller = new AbortController();
  const signal = controller.signal;

  const onSubmit = async (data: FormData) => {
    "use server";
    const ui = render({
      model: "gpt-4-0125-preview",
      provider: openai,
      messages: [{ role: "system", content: "You are a flight assistant" }],
      // `text` is called when an AI returns a text response (as opposed to a tool call).
      // Its content is streamed from the LLM, so this function will be called
      // multiple times with `content` being incremental.
      text: ({ content, done }) => {
        if (done) {
          return <p>{content}</p>;
        }
      },
      tools: {
        get_city_weather: {
          description: "Get the current weather for a city",
          parameters: z
            .object({
              city: z.string().describe("the city"),
            })
            .required(),
          render: async function* ({ city }) {
            yield <Spinner />;
            return <MyCard />;
          },
        },
      },
    });
    // try {
    //   const it = streamingFetch(
    //     `${process.env.NEXT_PUBLIC_URL}/api/v1/stream`,
    //     {
    //       data,
    //     },
    //     { signal },
    //   );
    //   for await (let value of it) {
    //     try {
    //       const chunk = value;
    //       setData((prev) => [...prev, chunk]);
    //     } catch (e: any) {
    //       console.warn(e.message);
    //     }
    //   }
    // } catch (error) {
    // } finally {
    // }
  };
  return (
    <div className="flex flex-col h-full p-2 md:p-2 pt-6 gap-2">
      <ScrollArea className="flex-grow h-5/6">
        {/* {data.map((chunk, index) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: chunk }} />
        ))} */}
      </ScrollArea>
      <div>
        <StreamPrompt onSubmit={onSubmit} />
      </div>
    </div>
  );
}
