import { SHARED_APP_CONFIG } from '@/shared/lib/app-config';

export const APP_CONFIG = {
  ...SHARED_APP_CONFIG,
  ADMIN_URL: import.meta.env.VITE_HELPDESK_ADMIN_URL as string,
};
