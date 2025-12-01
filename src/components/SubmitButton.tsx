'use client';

import { useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  text: string;
}

export default function SubmitButton({ text }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="mt-2 w-full lg:py-6 lg:text-lg py-4 text-md"
    >
      {pending ? (
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
      ) : null}
      {pending ? "Processing..." : text}
    </Button>
  );
}
