'use client';

import { createPlatePlugin } from '@udecode/plate/react';

import { FloatingToolbar } from '@betterdocs/ui';
import { FloatingToolbarButtons } from '@betterdocs/ui';

export const FloatingToolbarPlugin = createPlatePlugin({
  key: 'floating-toolbar',
  render: {
    afterEditable: () => (
      <FloatingToolbar>
        <FloatingToolbarButtons />
      </FloatingToolbar>
    ),
  },
});
