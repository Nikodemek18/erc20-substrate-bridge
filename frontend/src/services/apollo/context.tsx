import React, { useState } from 'react';
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks';
import {
  introspectSchema,
  makeRemoteExecutableSchema,
  addMockFunctionsToSchema,
  MockList,
} from 'graphql-tools';
import { SchemaLink } from 'apollo-link-schema';
import ApolloClient from 'apollo-client';

import { getEnv } from 'core/getEnv';

import { defaultApolloClient, apolloLink, createApolloClient } from './apolloClient';

interface Props {
  children: React.ReactNode;
}

async function createMockApolloClient() {
  const schema = await introspectSchema(apolloLink);
  const executableSchema = makeRemoteExecutableSchema({ schema });

  const mocks = {
    Query: () => ({
      limits: () => new MockList(10),
      limitProposals: () =>
        new MockList(10, () => ({
          ethAddress: () => '0x0000000000000000000000000000000000000000000000000000000000000000',
        })),
    }),
    BigInt: () => '123456',
  };

  addMockFunctionsToSchema({
    schema: executableSchema,
    mocks,
  });

  const mockLink = new SchemaLink({ schema: executableSchema });
  return createApolloClient(mockLink);
}

export function ApolloProvider({ children }: Props) {
  const { isMockServer } = getEnv();
  const [apolloClient, setApolloClient] = useState<ApolloClient<any> | null>(() =>
    isMockServer ? null : defaultApolloClient,
  );

  React.useEffect(() => {
    isMockServer && createMockApolloClient().then(setApolloClient);
  }, []);

  if (apolloClient) {
    return <ApolloHooksProvider client={apolloClient}>{children}</ApolloHooksProvider>;
  }
  return <>Mock server is loading...</>;
}
