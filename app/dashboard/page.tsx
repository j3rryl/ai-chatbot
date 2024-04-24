import InputPrompt from "@/components/forms/input-prompt";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessagePrompts } from "@/types/message";

const fetchPrompts = async () => {
  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/chat`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const messages: MessagePrompts = await result.json();
    return messages;
  } catch (error) {
    console.log(error);
  }
};
export default async function Page() {
  const messages = await fetchPrompts();
  return (
    <div className="flex flex-col h-full p-2 md:p-2 pt-6 gap-2">
      <ScrollArea className="flex-grow h-5/6">
        {messages?.data?.map((item, index) => {
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
                <p>{item.message}</p>
              </div>
            </div>
          );
        })}
      </ScrollArea>
      <div>{/* <InputPrompt /> */}</div>
    </div>
  );
}
