import { Logo } from "@/components/custom/Logo";
import { getUserMeLoader } from "@/data/services/get-user-me-loader";
import Link from "next/link";
import { SummaryForm } from "../forms/SummeryForm";
import { Button } from "../ui/button";
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
    <div className="flex gap-2 items-center">
      <Link
        href="/dashboard/account"
        className="font-semibold text-gray-700 dark:text-gray-300 hover:text-primary"
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
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col sm:flex-row sm:justify-between gap-2 items-center px-4 py-3 bg-white dark:bg-gray-800 shadow-lg rounded-xl sm:rounded-none dark:shadow-gray-900">
      <div className="flex items-center justify-between w-full sm:w-fit mr-4 order-1 sm:order-1">
        <Logo text={logoText[0]?.text} />
      </div>
      <div className="absolute right-4 top-4 sm:static sm:top-auto sm:right-auto flex items-center gap-4 order-2 sm:order-3">
        {user.ok ? (
          <LoggedInUser userData={user.data} />
        ) : (
          <Link href={String(ctaButton[0].url)}>
            <Button className="bg-primary text-white hover:bg-primary-dark px-4 py-2 rounded shadow-md dark:shadow-gray-900">
              {ctaButton[0].text}
            </Button>
          </Link>
        )}
      </div>
      {user.ok && (
        <div className="w-full  sm:mt-0 sm:w-full sm:px-2 sm:flex sm:justify-center order-3 sm:order-2">
          <SummaryForm />
        </div>
      )}
    </div>
  );
}
