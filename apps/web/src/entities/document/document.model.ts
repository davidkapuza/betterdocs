import { StateCreator, create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createSelectors } from '@/shared/lib/zustand';

type State = {
  selectedDocumentId: number | null;
};

type Actions = {
  setSelectedDocumentId: (selectedDocumentId: State['selectedDocumentId']) => void;
};

function createDocumentSlice() {
  const documentSlice: StateCreator<
    State & Actions,
    [['zustand/devtools', never]],
    [],
    State & Actions
  > = (set) => ({
    selectedDocumentId: null,
    setSelectedDocumentId: (selectedDocumentId: State['selectedDocumentId']) =>
      set({ selectedDocumentId }, false, 'setSelectedDocumentId'),
  });
  return documentSlice;
}

const slice = createDocumentSlice();
const withDevtools = devtools(slice, { name: 'Document Store' });
const store = create(withDevtools);
export const useDocumentStore = createSelectors(store);
