"use client"

import { toast } from "sonner"

import { Button } from "@/components/button"

export function SonnerDemo(description:any,text:any) {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast(text, {
          description: `${description}`,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
    >
      Show Toast
    </Button>
  )
}
