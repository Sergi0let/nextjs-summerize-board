"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

import { SubmitButton } from "@/components/custom/SubmitButton";
import { Input } from "@/components/ui/input";
import { createSummaryAction } from "@/data/actions/summary-actions";
import { generateSummaryService } from "@/data/services/summary-service";
import { extractYouTubeID } from "@/lib/utils";

interface StrapiErrorsProps {
  message: string | null;
  name: string;
}

const INITIAL_STATE = {
  message: null,
  name: "",
};

export function SummaryForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<StrapiErrorsProps>(INITIAL_STATE);
  const [value, setValue] = useState<string>("");

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    toast.success("Submitting Form");

    const formData = new FormData(event.currentTarget);
    const videoId = formData.get("videoId") as string;

    const processedVideoId = extractYouTubeID(videoId);

    if (!processedVideoId) {
      toast.error("Invalid Youtube Video ID");
      setLoading(false);
      setValue("");
      setError({
        ...INITIAL_STATE,
        message: "Invalid Youtube Video ID",
        name: "Invalid Id",
      });
      return;
    }

    toast.success("Generating Summary");

    const summaryResponseData = await generateSummaryService(videoId);

    if (summaryResponseData.error) {
      setValue("");
      toast.error(summaryResponseData.error);
      setError({
        ...INITIAL_STATE,
        message: summaryResponseData.error,
        name: "Summary Error",
      });
      setLoading(false);
      return;
    }

    const payload = {
      data: {
        title: `Summary for video: ${processedVideoId}`,
        videoId: processedVideoId,
        summary: summaryResponseData.data,
      },
    };

    try {
      await createSummaryAction(payload);
    } catch {
      toast.error("Error Creating Summary");
      setError({
        ...INITIAL_STATE,
        message: "Error Creating Summary",
        name: "Summary Error",
      });
      setLoading(false);
      return;
    }

    toast.success("Summary Created");
    setLoading(false);
  }

  function clearError() {
    setError(INITIAL_STATE);
    if (error.message) setValue("");
  }

  const errorStyles = error.message
    ? "outline-1 outline outline-red-500 placeholder:text-red-700"
    : "";

  return (
    <div className="w-full max-w-[960px]">
      <form
        onSubmit={handleFormSubmit}
        className="flex gap-2 items-center justify-center"
      >
        <Input
          name="videoId"
          placeholder={
            error.message ? error.message : "Youtube Video ID or URL"
          }
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onMouseDown={clearError}
          className={cn(
            "w-full focus:text-black focus-visible:ring-pink-500",
            errorStyles
          )}
          required
        />

        <SubmitButton
          text="Create Summary"
          loadingText="Creating Summary"
          loading={loading}
        />
      </form>
    </div>
  );
}
