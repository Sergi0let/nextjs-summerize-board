import { getUserMeLoader } from "@/data/services/get-user-me-loader";
import Link from "next/link";
import { Button } from "../ui/button";
import { StrapiImage } from "./StrapiImage";

export interface LinkProps {
  id: number;
  url: string;
  text: string;
  isExternal: boolean;
}
export interface ImageProps {
  id: string;
  documentId: string;
  url: string;
  alternativeText: string;
}
export interface HeroSectionProps {
  data: {
    __component: string;
    id: number;
    heading: string;
    subHeading: string;
    image: ImageProps;
    link: LinkProps;
  };
}

export default async function HeroSection({
  data,
}: Readonly<HeroSectionProps>) {
  const { heading, subHeading, link, image } = data;
  const user = await getUserMeLoader();
  const linkUrl = user.ok ? "dashboard" : link.url;

  return (
    <header className="relative h-[600px] overflow-hidden">
      <StrapiImage
        src={image.url}
        alt="background"
        className="absolute inset-0 object-cover w-full h-full aspect/16:9"
        width={1920}
        height={1080}
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-4xl text-white font-bold md:text-5xl lg:text-6xl">
          {heading} Heading
        </h1>
        <p className="mt-4 text-lg text-white md:text-xl lg:text-2xl">
          {subHeading}
        </p>
        <Button
          asChild
          variant={"secondary"}
          className="mt-8 inline-flex items-center justify-center px-6 py-3 text-base font-bold"
        >
          <Link href={linkUrl}>{user.ok ? "Go to Dashboard" : link.text}</Link>
        </Button>
      </div>
    </header>
  );
}
