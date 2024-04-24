import { prompts } from "@/types/message";

export async function GET(request: Request) {
  const myPrompts = prompts;
  return Response.json({
    data: myPrompts,
    message: "Endpoint hit successfully!",
  });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // eslint-disable-next-line no-console
    console.log("Sent data", data);
    return Response.json({ message: "Data posted successfully!" });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return new Response(`System error`, {
      status: 400,
    });
  }
}
