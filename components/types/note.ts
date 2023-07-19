export type SubNote = {
  title: string;
  description: string;
  date: number;
  important: boolean;
  level: number;
};

export type SubNoteWithId = SubNote & { id: string };

export type Note = SubNote & {
  subNotes?: SubNoteWithId[];
};

export type NoteWithId = Note & {
  id: string;
  uid: string;
};
