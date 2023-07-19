import { Note, NoteWithId } from "@/components/types/note";
import { firestore } from "./app";

const notesRef = firestore.collection(
  "Notes"
) as FirebaseFirestore.CollectionReference<NoteWithId>;

const getNotes = (uid: string): FirebaseFirestore.Query<NoteWithId> =>
  notesRef.where("uid", "==", uid);

const getNote = (id: string) => notesRef.doc(id).get();

const addNote = async (note: NoteWithId) => notesRef.doc(note.id).set(note);

const updateNote = async (note: NoteWithId) =>
  notesRef.doc(note.id).update(note);

const deleteNote = async (id: string) => notesRef.doc(id).delete();

export { getNotes, getNote, addNote, updateNote, deleteNote };
