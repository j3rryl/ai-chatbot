"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommandIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Textarea } from "../ui/textarea";
import { MessageResult } from "@/types/message";

const formSchema = z.object({
  prompt: z.string(),
});

type InputFormValue = z.infer<typeof formSchema>;

export default function InputPrompt() {
  const [loading, setLoading] = useState<boolean>(false);
  const defaultValues = {
    prompt: "How may I help you today?",
  };
  const form = useForm<InputFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: InputFormValue) => {
    try {
      setLoading(true);
      const result = await fetch("/api/v1/chat", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        method: "POST",
      });
      const message: MessageResult = await result.json();
      alert(message.message);
    } catch (error) {
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-full flex items-center justify-between gap-2"
        >
          <div className="w-full">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Email</FormLabel> */}
                  <FormControl>
                    <Textarea
                      rows={1}
                      placeholder="Howdy' mate?"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} type="submit" size="sm">
            <CommandIcon />
          </Button>
        </form>
      </Form>
    </>
  );
}
