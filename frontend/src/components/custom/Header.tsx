import { Logo } from "@/components/custom/Logo";
import { Button } from "@/components/ui/button";
import { getUserMeLoader } from "@/data/services/get-user-me-loader";
import Link from "next/link";
import { SummaryForm } from "../forms/SummeryForm";
import { LogoutButton } from "./LogoutButton";

interface AuthUserProps {
  username: string;
  email: string;
}

export function LoggedInUser({
  userData,
}: {
  readonly userData: AuthUserProps;
}) {
  return (
    <div className="flex gap-2">
      <Link
        href="/dashboard/account"
        className="font-semibold hover:text-primary"
      >
        {userData.username}
      </Link>
      <LogoutButton />
    </div>
  );
}
interface HeaderProps {
  data: {
    logoText: [
      {
        id: number;
        text: string;
        url: string;
      }
    ];
    ctaButton: [
      {
        id: number;
        text: string;
        url: string;
      }
    ];
  };
}

export async function Header({ data }: Readonly<HeaderProps>) {
  const user = await getUserMeLoader();
  const { logoText, ctaButton } = data;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white shadow-md dark:bg-gray-800">
      <Logo text={logoText[0].text} />
      {user.ok && <SummaryForm />}
      <div className="flex items-center gap-4">
        {user.ok ? (
          <LoggedInUser userData={user.data} />
        ) : (
          <Link href={String(ctaButton[0].url)}>
            <Button>{ctaButton[0].text}</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
