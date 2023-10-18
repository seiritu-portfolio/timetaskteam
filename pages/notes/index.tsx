import { ReactElement } from 'react';
import NotesLayout from '@component/layout/NotesLayout';

const Notes = () => {
  return null;
};

export default Notes;

Notes.getLayout = function getLayout(page: ReactElement) {
  return <NotesLayout>{page}</NotesLayout>;
};
