"use client";
import {
  ReactElement,
  ReactNode,
  useContext,
  useState,
  createContext,
  useEffect,
} from "react";
import axios, { AxiosResponse } from "axios";
import { Note, NoteWithId } from "../types/note";
import { useAuthContext } from "./useAuthContext";

// Type definitions for useNoteContext
type DataProviderType = ({ children }: { children: ReactNode }) => ReactElement;
type AddNote = (note: Note) => Promise<boolean>;
type UpdateNote = (note: NoteWithId) => Promise<boolean>;
type DeleteNote = (note: NoteWithId) => Promise<boolean>;
type ContextValue = {
  notes: NoteWithId[];
  loading: boolean;
  addNote: AddNote;
  updateNote: UpdateNote;
  deleteNote: DeleteNote;
  refreshNotes: () => Promise<void>;
};

// Create the context
const DataContext = createContext<ContextValue | undefined>(undefined);

// Use the context
const useDataContext = (): ContextValue => {
  return useContext(DataContext) as ContextValue;
};

// Create the provider
const DataProvider: DataProviderType = ({ children }) => {
  const [notes, setNotes] = useState<NoteWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { currentUser } = useAuthContext();

  useEffect(() => {
    setNotes([]);
    refreshNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const refreshNotes = async () => {
    if (currentUser?.access_token) {
      setLoading(true);
      axios
        .get<NoteWithId[]>("/api/note", {
          headers: {
            Authorization: "Bearer " + currentUser.access_token,
          },
        })
        .then(({ data }) => {
          setNotes(data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const addNote: AddNote = async (note: Note) => {
    if (!currentUser?.access_token) {
      return false;
    }

    const res: AxiosResponse<NoteWithId> = await axios.put("/api/note", note, {
      headers: {
        Authorization: "Bearer " + currentUser.access_token,
      },
    });
    if (res.status === 200) {
      const newNote = res.data;
      setNotes((curr) => [...curr, newNote]);
      return true;
    }
    return false;
  };

  const updateNote: UpdateNote = async (note: NoteWithId) => {
    if (!currentUser?.access_token) {
      return false;
    }
    const res: AxiosResponse<NoteWithId> = await axios.patch(
      "/api/note",
      note,
      {
        headers: {
          Authorization: "Bearer " + currentUser.access_token,
        },
      }
    );
    const updatedNote = res.data;
    if (res.status === 200) {
      setNotes((notes) => {
        return notes.map((note) => {
          if (note.id == updatedNote.id) {
            return updatedNote;
          }
          return note;
        });
      });
      return true;
    }
    return false;
  };

  const deleteNote: DeleteNote = async (note: NoteWithId) => {
    if (!currentUser?.access_token) {
      return false;
    }
    const res: AxiosResponse = await axios.delete("/api/note", {
      headers: {
        Authorization: "Bearer " + currentUser.access_token,
        id: note.id,
      },
    });
    if (res.status === 200) {
      setNotes((notes) => {
        return notes.filter((t) => {
          if (t.id == note.id) {
            return false;
          }
          return true;
        });
      });
      return true;
    }
    return false;
  };

  const value = {
    notes,
    loading,
    addNote,
    updateNote,
    deleteNote,
    refreshNotes,
  };

  // Return the provider
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export { DataProvider, useDataContext as useDataContext };
export default DataContext;
