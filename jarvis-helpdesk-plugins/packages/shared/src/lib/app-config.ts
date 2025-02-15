export const SHARED_APP_CONFIG = {
  MODE: import.meta.env.MODE,
  HELPDESK_PLUGINS_API_URL: import.meta.env.VITE_HELPDESK_PLUGINS_API_URL,
  STACK: {
    API_URL: import.meta.env.VITE_STACK_API_URL as string,
    PROJECT_ID: import.meta.env.VITE_STACK_PROJECT_ID as string,
    PUBLISHABLE_CLIENT_KEY: import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY as string,
  },
  STACK_AUTH_URL: `${import.meta.env.VITE_STACK_AUTH_PAGE_URL}?${new URLSearchParams({
    client_id: 'helpdesk_plugin',
    redirect: import.meta.env.VITE_HOME_PAGE_URL + '/auth/oauth/success',
  })}`,
  EA_EXTENSION_ID: import.meta.env.VITE_EA_EXTENSION_ID as string,
  PANCAKE_EXTENSION_ID: import.meta.env.VITE_PANCAKE_EXTENSION_ID as string,
};
