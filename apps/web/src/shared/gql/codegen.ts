import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'apps/api/graphql/schema.gql',
  documents: ['apps/web/src/**/*.graphql'],
  generates: {
    'apps/web/src/shared/gql/__generated__/types.ts': {
      plugins: ['typescript'],
      config: {
        useIndexSignature: true,
      },
    },
    'apps/web/src/shared/gql/__generated__/operations.ts': {
      plugins: ['typescript-operations', 'typescript-react-apollo'],
      config: {
        useIndexSignature: true,
        importTypesFrom: './types',
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
