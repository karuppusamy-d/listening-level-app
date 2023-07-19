"use client";
import { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/contexts/useAuthContext";
import { useDataContext } from "@/components/contexts/useDataContext";
import NoteCard from "@/components/NoteCard";
import NewNote from "@/components/Popup/NewNote";
import Popup from "@/components/Popup";
import Loading from "@/components/Loading";

const Home = (): ReactElement => {
  const router = useRouter();
  const { currentUser } = useAuthContext();
  const { loading, notes } = useDataContext();
  const [showNewNote, setShowNewNote] = useState(false);
  const toggleNewNote = () => setShowNewNote((curr) => !curr);

  useEffect(() => {
    // Redirect if user not logged in
    if (!currentUser) {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen py-4 px-2 xs:px-4 pb-8 md:px-8 sm:py-8">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between px-4 grid-cols-1">
          <h2 className="text-2xl font-bold">All Listenings</h2>
          <button
            className="btn"
            onClick={() => setShowNewNote((curr) => !curr)}
          >
            Add Listening
          </button>
        </div>
        {notes.map((note, i) => {
          return <NoteCard key={i} note={note} />;
        })}

        {notes.length <= 0 && (
          <div className="rounded-lg shadow-light dark:shadow-card-dark p-8 sm:p-10">
            <div className="flex items-start gap-3 justify-between flex-wrap">
              <h2>No listenings found</h2>
            </div>
          </div>
        )}
      </div>
      {/* New projects popup */}
      <Popup showPopup={showNewNote} togglePopup={toggleNewNote}>
        <NewNote togglePopup={toggleNewNote} />
      </Popup>
    </div>
  );
};

export default Home;
