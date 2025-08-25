export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return <SignIn />;
}
