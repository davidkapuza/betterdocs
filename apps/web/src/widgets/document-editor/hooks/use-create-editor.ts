'use client';

import type { Value } from '@udecode/plate';

import { withProps } from '@udecode/cn';
import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import {
  CodeBlockPlugin,
  CodeLinePlugin,
  CodeSyntaxPlugin,
} from '@udecode/plate-code-block/react';
import { DatePlugin } from '@udecode/plate-date/react';
import { EmojiInputPlugin } from '@udecode/plate-emoji/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { TocPlugin } from '@udecode/plate-heading/react';
import { HighlightPlugin } from '@udecode/plate-highlight/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { KbdPlugin } from '@udecode/plate-kbd/react';
import { ColumnItemPlugin, ColumnPlugin } from '@udecode/plate-layout/react';
import { LinkPlugin } from '@udecode/plate-link/react';
import {
  EquationPlugin,
  InlineEquationPlugin,
} from '@udecode/plate-math/react';
import {
  MentionInputPlugin,
  MentionPlugin,
} from '@udecode/plate-mention/react';
import { SlashInputPlugin } from '@udecode/plate-slash-command/react';
import {
  TableCellHeaderPlugin,
  TableCellPlugin,
  TablePlugin,
  TableRowPlugin,
} from '@udecode/plate-table/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import {
  type CreatePlateEditorOptions,
  ParagraphPlugin,
  PlateLeaf,
  usePlateEditor,
} from '@udecode/plate/react';

import { editorPlugins } from '../plugins/editor-plugins';
import { FixedToolbarPlugin } from '../plugins/fixed-toolbar-plugin';
import { FloatingToolbarPlugin } from '../plugins/floating-toolbar-plugin';
import { BlockquoteElement } from '@betterdocs/plate-ui/blockquote-element';
import { CodeBlockElement } from '@betterdocs/plate-ui/code-block-element';
import { CodeLeaf } from '@betterdocs/plate-ui/code-leaf';
import { CodeLineElement } from '@betterdocs/plate-ui/code-line-element';
import { CodeSyntaxLeaf } from '@betterdocs/plate-ui/code-syntax-leaf';
import { ColumnElement } from '@betterdocs/plate-ui/column-element';
import { ColumnGroupElement } from '@betterdocs/plate-ui/column-group-element';
import { DateElement } from '@betterdocs/plate-ui/date-element';
import { EmojiInputElement } from '@betterdocs/plate-ui/emoji-input-element';
import { EquationElement } from '@betterdocs/plate-ui/equation-element';
import { HeadingElement } from '@betterdocs/plate-ui/heading-element';
import { HighlightLeaf } from '@betterdocs/plate-ui/highlight-leaf';
import { HrElement } from '@betterdocs/plate-ui/hr-element';
import { InlineEquationElement } from '@betterdocs/plate-ui/inline-equation-element';
import { KbdLeaf } from '@betterdocs/plate-ui/kbd-leaf';
import { LinkElement } from '@betterdocs/plate-ui/link-element';
import { MentionElement } from '@betterdocs/plate-ui/mention-element';
import { MentionInputElement } from '@betterdocs/plate-ui/mention-input-element';
import { ParagraphElement } from '@betterdocs/plate-ui/paragraph-element';
import { withPlaceholders } from '@betterdocs/plate-ui/placeholder';
import { SlashInputElement } from '@betterdocs/plate-ui/slash-input-element';
import {
  TableCellElement,
  TableCellHeaderElement,
} from '@betterdocs/plate-ui/table-cell-element';
import { TableElement } from '@betterdocs/plate-ui/table-element';
import { TableRowElement } from '@betterdocs/plate-ui/table-row-element';
import { TocElement } from '@betterdocs/plate-ui/toc-element';
import { ToggleElement } from '@betterdocs/plate-ui/toggle-element';

export const viewComponents = {
  [BlockquotePlugin.key]: BlockquoteElement,
  [BoldPlugin.key]: withProps(PlateLeaf, { as: 'strong' }),
  [CodeBlockPlugin.key]: CodeBlockElement,
  [CodeLinePlugin.key]: CodeLineElement,
  [CodePlugin.key]: CodeLeaf,
  [CodeSyntaxPlugin.key]: CodeSyntaxLeaf,
  [ColumnItemPlugin.key]: ColumnElement,
  [ColumnPlugin.key]: ColumnGroupElement,
  [DatePlugin.key]: DateElement,
  [EquationPlugin.key]: EquationElement,
  [HEADING_KEYS.h1]: withProps(HeadingElement, { variant: 'h1' }),
  [HEADING_KEYS.h2]: withProps(HeadingElement, { variant: 'h2' }),
  [HEADING_KEYS.h3]: withProps(HeadingElement, { variant: 'h3' }),
  [HEADING_KEYS.h4]: withProps(HeadingElement, { variant: 'h4' }),
  [HEADING_KEYS.h5]: withProps(HeadingElement, { variant: 'h5' }),
  [HEADING_KEYS.h6]: withProps(HeadingElement, { variant: 'h6' }),
  [HighlightPlugin.key]: HighlightLeaf,
  [HorizontalRulePlugin.key]: HrElement,
  [InlineEquationPlugin.key]: InlineEquationElement,
  [ItalicPlugin.key]: withProps(PlateLeaf, { as: 'em' }),
  [KbdPlugin.key]: KbdLeaf,
  [LinkPlugin.key]: LinkElement,
  [MentionPlugin.key]: MentionElement,
  [ParagraphPlugin.key]: ParagraphElement,
  [StrikethroughPlugin.key]: withProps(PlateLeaf, { as: 's' }),
  [SubscriptPlugin.key]: withProps(PlateLeaf, { as: 'sub' }),
  [SuperscriptPlugin.key]: withProps(PlateLeaf, { as: 'sup' }),
  [TableCellHeaderPlugin.key]: TableCellHeaderElement,
  [TableCellPlugin.key]: TableCellElement,
  [TablePlugin.key]: TableElement,
  [TableRowPlugin.key]: TableRowElement,
  [TocPlugin.key]: TocElement,
  [TogglePlugin.key]: ToggleElement,
  [UnderlinePlugin.key]: withProps(PlateLeaf, { as: 'u' }),
};

export const editorComponents = {
  ...viewComponents,
  [EmojiInputPlugin.key]: EmojiInputElement,
  [MentionInputPlugin.key]: MentionInputElement,
  [SlashInputPlugin.key]: SlashInputElement,
};

export const useCreateEditor = (
  {
    components,
    override,
    readOnly,
    ...options
  }: {
    components?: Record<string, any>;
    plugins?: any[];
    readOnly?: boolean;
  } & Omit<CreatePlateEditorOptions, 'plugins'> = {},
  deps: any[] = []
) => {
  return usePlateEditor<Value>(
    {
      override: {
        components: {
          ...(readOnly ? viewComponents : withPlaceholders(editorComponents)),
          ...components,
        },
        ...override,
      },
      plugins: [
        ...editorPlugins,
        /* FixedToolbarPlugin, */ FloatingToolbarPlugin,
      ],
      ...options,
    },
    deps
  );
};
