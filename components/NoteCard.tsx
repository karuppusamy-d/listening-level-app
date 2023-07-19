import React, { ReactElement, useState } from "react";
import { NoteWithId } from "./types/note";
import Icon from "./Icons";
import { useDataContext } from "./contexts/useDataContext";
import Popup from "./Popup";
import NewNote from "./Popup/NewNote";

type Props = {
  note: NoteWithId;
  parrentNote?: NoteWithId;
  innerNote?: boolean;
};

const NoteCard = ({ note, innerNote, parrentNote }: Props): ReactElement => {
  const { deleteNote, updateNote } = useDataContext();
  const [isRequestPending, setIsRequestPending] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<"add" | "update">("add");
  const [showPopup, setShowPopup] = useState(false);
  const toggleUpdate = () => setShowPopup((curr) => !curr);

  const handleDelete = async () => {
    if (isRequestPending) {
      return;
    }
    setIsRequestPending(true);
    if (!innerNote) {
      await deleteNote(note).catch(() => alert("Something went wrong"));
    } else if (parrentNote) {
      let updatedNote: NoteWithId = parrentNote;
      updatedNote.subNotes =
        updatedNote.subNotes?.filter((curr) => {
          if (curr.id === note.id) {
            return false;
          }
          return true;
        }) || [];
      await updateNote(updatedNote).catch(() => alert("Something went wrong"));
    }
    setIsRequestPending(false);
  };

  const handleUpdate = (type: "level" | "important") => async () => {
    if (isRequestPending) {
      return;
    }
    setIsRequestPending(true);
    let updatedNote: NoteWithId = note;
    if (innerNote && parrentNote) {
      updatedNote = parrentNote;
      updatedNote.subNotes =
        updatedNote.subNotes?.map((curr) => {
          if (note.id === curr.id) {
            if (type === "level") {
              if (curr.level >= 3) curr.level = 1;
              else curr.level += 1;
            }
            if (type === "important") curr.important = !curr.important;
            return curr;
          }
          return curr;
        }) || [];
    } else {
      if (type === "level") {
        if (updatedNote.level >= 3) updatedNote.level = 1;
        else updatedNote.level += 1;
      }
      if (type === "important") updatedNote.important = !updatedNote.important;
    }

    await updateNote(updatedNote).catch(() => alert("Something went wrong"));
    setIsRequestPending(false);
  };

  return (
    <div
      className={`rounded-lg shadow-light dark:shadow-card-dark ${
        innerNote ? "p-6" : "p-8 sm:p-10"
      }`}
    >
      <div className="flex items-start gap-3 justify-between flex-wrap">
        <h2
          className={`font-bold break-words ${
            innerNote ? "text-lg" : "text-xl sm:text-2xl"
          }`}
        >
          {note.title}
        </h2>
        <div
          className={`flex items-start gap-3 ${
            innerNote ? "text-lg" : "text-xl"
          }`}
        >
          {!innerNote && (
            <>
              <button
                aria-label="Edit"
                title="Edit"
                onClick={() => {
                  setPopupType("update");
                  setShowPopup(true);
                }}
              >
                <Icon kind={"edit"} />
              </button>
              <button
                aria-label="Add Note"
                title="Add Note"
                onClick={() => {
                  setPopupType("add");
                  setShowPopup(true);
                }}
              >
                <Icon kind={"add"} />
              </button>
            </>
          )}
          <button
            aria-label="Important"
            title="Important"
            onClick={handleUpdate("important")}
          >
            <Icon
              className="text-amber-300"
              kind={note.important ? "starFilled" : "star"}
            />
          </button>

          <button
            aria-label="Level"
            title="Level"
            onClick={handleUpdate("level")}
            className="bg-green-200 dark:bg-green-300 font-medium rounded text-xs h-5 px-4"
          >
            {/* <Icon
              className="text-green-300"
              kind={note.level ? "completeFilled" : "complete"}
            /> */}
            {note.level === 1 && "Internal"}
            {note.level === 2 && "Focused"}
            {note.level === 3 && "Global"}
          </button>
          <button
            aria-label="Delete"
            title="Delete"
            onClick={() => handleDelete()}
          >
            <Icon className="text-red-400" kind={"delete"} />
          </button>
        </div>
      </div>

      {note.description && (
        <div className="text-sm text-gray-700 break-words dark:text-gray-300 mt-2">
          {note.description}
        </div>
      )}

      {!innerNote && note.subNotes && note.subNotes?.length > 0 && (
        <div className="flex flex-col gap-4 pt-6">
          {note.subNotes.map((currentNote, i) => {
            return (
              <NoteCard
                key={i}
                note={{ ...currentNote, uid: note.uid }}
                parrentNote={note}
                innerNote
              />
            );
          })}
        </div>
      )}

      {/* Update projects popup */}
      {showPopup && (
        <Popup showPopup={showPopup} togglePopup={toggleUpdate}>
          <NewNote
            togglePopup={toggleUpdate}
            update={popupType == "update"}
            noteData={note}
          />
        </Popup>
      )}
    </div>
  );
};

export default NoteCard;
