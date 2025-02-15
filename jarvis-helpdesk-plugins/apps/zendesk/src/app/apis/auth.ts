import helpdeskPluginsApiAxios from '@/shared/lib/clients/axios/helpdesk-plugins-api';

const verifyDomain = async (domain: string): Promise<boolean> => {
  try {
    const res = await helpdeskPluginsApiAxios.get(`api/v1/zendesk/verify-domain/${domain}`);
    return res.status === 200;
  } catch (error) {
    console.error('Error verifying domain:', error);
    throw error;
  }
};

export const ZendeskAuthApi = {
  verifyDomain,
};
