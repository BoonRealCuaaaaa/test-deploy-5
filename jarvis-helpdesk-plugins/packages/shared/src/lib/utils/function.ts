export const startChainable = async <T>(fn: () => T): Promise<T> => {
  return await fn();
};
