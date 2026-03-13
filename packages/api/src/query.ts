export const createQueryOptions = <T>(key: string[], fetcher: () => Promise<T>) => ({
  queryKey: key,
  queryFn: fetcher,
});

export const createMutationOptions = <TData, TVariables>(
  mutationFn: (vars: TVariables) => Promise<TData>,
) => ({ mutationFn });
