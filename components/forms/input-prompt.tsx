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

const formSchema = z.object({
  prompt: z.string(),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function InputPrompt() {
  const [loading, setLoading] = useState<boolean>(false);
  const defaultValues = {
    prompt: "How may I help you today?",
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    alert("Hello User!" + data.prompt);

    setTimeout(() => {
      setLoading(false);
    }, 3000);
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
