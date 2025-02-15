export const convertEmailToName = (email: string): string => {
  return email.split('@')[0] ?? '';
};
