'use client';

import { LinkPlugin } from '@udecode/plate-link/react';

import { LinkFloatingToolbar } from '@betterdocs/ui';

export const linkPlugin = LinkPlugin.extend({
  render: { afterEditable: () => <LinkFloatingToolbar /> },
});
