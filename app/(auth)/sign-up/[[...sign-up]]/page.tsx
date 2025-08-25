export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import { SignUp } from "@clerk/nextjs";

export default function Page() {
  // Skip during production build
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return <div>Loading...</div>;
  }
  
  return <SignUp />;
}
