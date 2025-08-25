export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import { setupUser } from "@/actions/billings";

async function SetupPage() {
  return await setupUser();
}

export default SetupPage;
