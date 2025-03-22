import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'graphql/schema.gql',
  documents: ['apps/web/src/**/*.graphql'],
  generates: {
    'apps/web/src/shared/gql/__generated__/operations.ts': {
      plugins: ['add', 'typescript-operations', 'typescript-react-apollo'],
      config: {
        useIndexSignature: true,
        content: 'import * as types from "@nx-apollo/models-graphql"',
        namespacedImportName: 'types',
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
