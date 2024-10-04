import { Button } from "@/components/ui/button";

async function getStrapiData(path: string) {
  const baseUrl = "http://localhost:1337/";
  try {
    const response = await fetch(baseUrl + path);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export default async function Home() {
  const strapiData = await getStrapiData("api/home-page");
  const { Title, description } = strapiData.data;
  console.log(Title, description);
  return (
    <div>
      <Button size={"sm"} className="w-full">
        Button
      </Button>
      <h1>{Title}</h1>
      <p>{description}</p>
    </div>
  );
}
