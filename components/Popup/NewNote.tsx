import {
  Dispatch,
  FormEvent,
  ReactElement,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuthContext } from "@/components/contexts/useAuthContext";
import { useDataContext } from "../contexts/useDataContext";
import { SubNote, SubNoteWithId, NoteWithId } from "../types/note";

interface Props {
  togglePopup: () => void;
  update?: boolean;
  noteData?: NoteWithId;
}

const NewNote = ({ togglePopup, update, noteData }: Props): ReactElement => {
  const [error, setError] = useState("");
  const [isRequestPending, setIsRequestPending] = useState<boolean>(false);
  const { currentUser } = useAuthContext();
  const { addNote, updateNote } = useDataContext();
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const levelRef = useRef<HTMLSelectElement>(null);

  // Function to handle form submission
  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    if (isRequestPending) {
      return;
    }
    setError("");
    e.preventDefault();
    if (
      !currentUser ||
      !titleRef.current ||
      !descriptionRef.current ||
      !levelRef.current
    )
      return setError("Something went wrong");

    const title = titleRef.current.value;
    const description = descriptionRef.current.value;
    const level = parseInt(levelRef.current.value) || 1;
    setIsRequestPending(true);

    if (update && noteData) {
      setIsRequestPending(true);
      const res = await updateNote({
        ...noteData,
        title,
        description,
        level,
      }).catch(() => setError("Something went wrong"));
      if (res === true) {
        togglePopup();
      }
      setIsRequestPending(false);
      return;
    }

    if (!update && noteData) {
      const note: SubNoteWithId = {
        title,
        description,
        level,
        important: false,
        id: Date.now().toString(),
        date: Date.now(),
      };
      const updatedNote: NoteWithId = {
        ...noteData,
        subNotes: noteData.subNotes ? [...noteData.subNotes, note] : [note],
      };
      const res = await updateNote(updatedNote).catch(() =>
        setError("Something went wrong")
      );
      if (res === true) {
        togglePopup();
      }
      setIsRequestPending(false);
      return;
    }

    const res = await addNote({
      title,
      description,
      level,
      important: false,
      date: Date.now(),
      subNotes: [],
    }).catch(() => setError("Something went wrong"));
    if (res === true) {
      togglePopup();
      titleRef.current.value = "";
      descriptionRef.current.value = "";
      levelRef.current.value = "1";
    }
    setIsRequestPending(false);
  }

  useEffect(() => {
    if (update) {
      if (
        !currentUser ||
        !titleRef.current ||
        !descriptionRef.current ||
        !levelRef.current
      )
        return setError("Something went wrong");

      titleRef.current.value = noteData?.title || "";
      descriptionRef.current.value = noteData?.description || "";
      levelRef.current.value = noteData?.level.toString() || "1";
    }
  }, [
    update,
    currentUser,
    noteData?.title,
    noteData?.description,
    noteData?.level,
  ]);

  return (
    <form
      className="flex flex-col sm:w-96 mb-[4.5rem] sm:mb-6"
      onSubmit={handleSubmit}
    >
      <h2 className="text-primary-400 dark:text-gray-100 text-center text-3xl font-bold mb-8">
        {update ? "Update Listening" : "Add Listening"}
      </h2>
      {/* Input for name */}
      <label className="font-semibold text-sm mb-2" htmlFor="title">
        Title
      </label>
      <input
        className="input"
        id="title"
        ref={titleRef}
        type="text"
        maxLength={25}
        required
      />
      {/* Input for description */}
      <label className="font-semibold text-sm mt-4 mb-2" htmlFor="description">
        Description
      </label>
      <textarea
        className="input"
        id="description"
        rows={4}
        maxLength={100}
        ref={descriptionRef}
      />
      {/* Input for listening level */}
      <label className="font-semibold text-sm mt-4 mb-2" htmlFor="level">
        Listening Level
      </label>
      <select className="input" id="level" ref={levelRef}>
        <option value="1">Internal</option>
        <option value="2">Focused</option>
        <option value="3">Global</option>
      </select>
      {/* Error messages */}
      {error && (
        <div className="mt-3 text-sm font-medium text-red-500 dark:text-red-400">
          {error}
        </div>
      )}
      <div className="flex gap-2 mt-8">
        {/* Cancel button */}
        <button
          className="btn btn-red h-10 rounded-lg w-full"
          onClick={togglePopup}
        >
          Cancel
        </button>

        {/* Submit button */}
        <button className="btn h-10 rounded-lg w-full" type="submit">
          {update ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
};

export default NewNote;
