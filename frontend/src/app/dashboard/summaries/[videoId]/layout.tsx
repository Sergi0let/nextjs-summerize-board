import { getSummaryById } from "@/data/loaders";
import { extractYouTubeID } from "@/lib/utils";
import dynamic from "next/dynamic";

const NoSSR = dynamic(() => import("@/components/custom/YouTubePlayer"), {
  ssr: false,
});

export default async function SummarySingleRoute({
  params,
  children,
}: {
  readonly params: { videoId: string };
  readonly children: React.ReactNode;
}) {
  try {
    // Завантаження даних для відео
    const data = await getSummaryById(params.videoId);

    // Перевірка на помилку 404
    if (data?.error?.status === 404) {
      return <p>No Items Found</p>;
    }

    // Витягування YouTube ID
    const videoId = extractYouTubeID(data.data.videoId);

    // Перевірка, чи є відео ID валідним
    if (!videoId) {
      return <p>Invalid video ID</p>;
    }

    // Рендер сторінки з відео та контентом
    return (
      <div className="h-full grid gap-4 grid-cols-5 p-4">
        <div className="col-span-3">{children}</div>
        <div className="col-span-2">
          <div>
            <NoSSR videoId={videoId} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading summary:", error);
    return (
      <p>
        An error occurred while fetching the summary. Please try again later.
      </p>
    );
  }
}
