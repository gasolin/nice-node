import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { NiceNodeRpcTranslation } from '../../common/rpcTranslation';
import { ethers } from '../ethers';
import { executeTranslation } from './rpcExecuteTranslation';

type CustomerErrorType = {
  message: string;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProviderResponse = any;

// const provider = new ethers.providers.WebSocketProvider('ws://localhost:8546');
const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');

// Define a service using a base URL and expected endpoints
// lots of issues in RTKQ github complaining about typescript breaking changes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RtkqExecutionWs: any = createApi({
  reducerPath: 'RtkqExecutionWs',
  baseQuery: fakeBaseQuery<CustomerErrorType>(),
  endpoints: (builder) => ({
    getExecutionLatestBlock: builder.query<
      ProviderResponse,
      NiceNodeRpcTranslation
    >({
      queryFn: async (rpcTranslation) => {
        let data;
        try {
          // data = await provider.send('eth_getBlockByNumber', ['latest', false]);
          console.log('peers rpcTranslation', rpcTranslation);
          data = await executeTranslation('latestBlock', rpcTranslation);
          console.log('peers data', data);
        } catch (e) {
          const error = { message: 'Unable to get syncing value' };
          console.log(e);
          return { error };
        }
        return { data };
      },
    }),
    getExecutionIsSyncing: builder.query<
      ProviderResponse,
      NiceNodeRpcTranslation
    >({
      queryFn: async (rpcTranslation) => {
        let data;
        try {
          // if (!rpcTranslation.sync) {
          //   console.log('No rpcTranslation found for sync');
          // }
          // data = await provider.send('eth_syncing');
          console.log('sync rpcTranslation', rpcTranslation);
          data = await executeTranslation('sync', rpcTranslation);
          console.log('sync data', data);
        } catch (e) {
          const error = { message: 'Unable to get syncing value' };
          console.log(e);
          return { error };
        }
        return { data };
      },
    }),
    getExecutionNetworkInfo: builder.query<ProviderResponse, null>({
      queryFn: async () => {
        const network = await provider.getNetwork();
        return { data: network };
      },
    }),
    getExecutionNodeInfo: builder.query<ProviderResponse, null>({
      queryFn: async () => {
        let data;
        // let error;
        try {
          data = await provider.send('web3_clientVersion');
        } catch (e) {
          const error = { message: 'Unable to get client version.' };
          console.log(e);
          return { error };
        }
        return { data };
      },
    }),
    getExecutionPeers: builder.query<ProviderResponse, NiceNodeRpcTranslation>({
      queryFn: async (rpcTranslation) => {
        let data;
        // let error;
        try {
          console.log('peers rpcTranslation', rpcTranslation);
          data = await executeTranslation('peers', rpcTranslation);
          console.log('peers data', data);

          // data = await provider.send('net_peerCount');
        } catch (e) {
          const error = { message: 'Unable to get peer count.' };
          console.log(e);
          return { error };
        }
        return { data };
      },
    }),
  }),
});

export const {
  useGetExecutionLatestBlockQuery,
  useGetExecutionIsSyncingQuery,
  useGetExecutionNetworkInfoQuery,
  useGetExecutionNodeInfoQuery,
  useGetExecutionChainIdQuery,
  useGetExecutionPeersQuery,
} = RtkqExecutionWs;
