// https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream
function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

const encoder = new TextEncoder();

async function* makeIterator() {
  yield encoder.encode("<p class='text-red' style='color: red;'>One</p>");
  await sleep(200);
  yield encoder.encode("<p>Two</p>");
  await sleep(200);
  yield encoder.encode("<p>Three</p>");
}
async function* makeIteratorResponse(query: string) {
  yield encoder.encode(`<p>You asked me; ${query}<p>`);
  await sleep(200);
  yield encoder.encode(
    "<p>My response is I am very good at literally everything 😁!</p>",
  );
  await sleep(200);
}

export async function GET() {
  const iterator = makeIterator();
  const stream = iteratorToStream(iterator);

  return new Response(stream);
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = json?.data;
    const iterator = makeIteratorResponse(data?.prompt);
    const stream = iteratorToStream(iterator);

    return new Response(stream);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return new Response(`System error`, {
      status: 400,
    });
  }
}
