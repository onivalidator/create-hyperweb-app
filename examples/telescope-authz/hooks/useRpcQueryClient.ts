import { useQuery } from '@tanstack/react-query';
import { cosmos } from '@/src/codegen';
import { useQueryHooks } from './useQueryHooks';

const { createRPCQueryClient } = cosmos.ClientFactory;

export const useRpcQueryClient = (chainName: string) => {
  const { rpcEndpoint } = useQueryHooks(chainName);

  const rpcQueryClientQuery = useQuery({
    queryKey: ['rpcQueryClient', rpcEndpoint],
    queryFn: () => createRPCQueryClient({ rpcEndpoint: rpcEndpoint || '' }),
    enabled: Boolean(rpcEndpoint),
    staleTime: Infinity,
  });

  return {
    isLoading: rpcQueryClientQuery.isLoading,
    rpcQueryClient: rpcQueryClientQuery.data,
  };
};
