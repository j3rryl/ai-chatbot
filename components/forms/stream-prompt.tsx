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
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  prompt: z.string(),
});

type InputFormValue = z.infer<typeof formSchema>;
type SubmitFunction = (form: FormData) => void;
interface StreamPromptProps {
  onSubmit: SubmitFunction;
}

const StreamPrompt: React.FC<StreamPromptProps> = ({ onSubmit }) => {
  const defaultValues = {
    prompt: "How may I help you today?",
  };
  const form = useForm<InputFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  return (
    <>
      <Form {...form}>
        <form
          action={onSubmit}
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
                    <Textarea rows={1} placeholder="Howdy' mate?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" size="sm">
            <CommandIcon />
          </Button>
        </form>
      </Form>
    </>
  );
};
export default StreamPrompt;
