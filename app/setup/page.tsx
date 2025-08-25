export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import { setupUser } from "@/actions/billings";

async function SetupPage() {
  // Skip during production build
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return <div>Loading...</div>;
  }
  
  return await setupUser();
}

export default SetupPage;
