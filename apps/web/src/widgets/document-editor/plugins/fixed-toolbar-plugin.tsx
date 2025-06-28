'use client';

import { createPlatePlugin } from '@udecode/plate/react';

import { FixedToolbar } from '@betterdocs/ui';
import { FixedToolbarButtons } from '@betterdocs/ui';

export const FixedToolbarPlugin = createPlatePlugin({
  key: 'fixed-toolbar',
  render: {
    beforeEditable: () => (
      <FixedToolbar>
        <FixedToolbarButtons />
      </FixedToolbar>
    ),
  },
});
