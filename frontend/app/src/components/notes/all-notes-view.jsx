import React, { useEffect, useState } from "react";
import styles from "./styles/all-notes-view.module.css";
import AddNotePopup from "./add-note-popup";
import { useDispatch, useSelector } from "react-redux";
import {
  editNote,
  removeNote,
  getSingleNote,
  bulkRemoveNotes,
  archiveNote, // ✅ import archive thunk
} from "../../store/slice/notes-slice";
import { toast } from "react-toastify";
import SingleNoteView from "./single-note-view";

const AllNotesView = ({ notes, loading, error }) => {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [editNoteData, setEditNoteData] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const singleNote = useSelector((state) => state.notes.single_note);

  const archivedCount = notes.filter((n) => n.archived).length;

// ✅ Keyboard shortcut (Shift+N for Add Note only, not edit)
useEffect(() => {
  const handleShortcut = (e) => {
    if (e.shiftKey && e.key.toLowerCase() === "n") {
      e.preventDefault();
      if (!editNoteData) {
        setShowAddPopup(true);
      }
    }
  };
  window.addEventListener("keydown", handleShortcut);
  return () => {
    window.removeEventListener("keydown", handleShortcut);
  };
}, [editNoteData]);

  // Filter notes based on toggle
  let displayedNotes = showArchived
    ? notes.filter((n) => n.archived)
    : notes.filter((n) => !n.archived);

  // Apply search filter (case insensitive)
  if (searchTerm.trim() !== "") {
    displayedNotes = displayedNotes.filter((n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  // Single delete
  const handleDelete = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await dispatch(removeNote(noteId)).unwrap();
      toast.success("Note deleted successfully!");
    } catch (err) {
      toast.error(err || "Failed to delete note.");
    }
  };

  // Archive toggle
  const handleArchive = async (note) => {
    try {
      await dispatch(
        archiveNote({ id: note.id, archived: !note.archived })
      ).unwrap();
      toast.success(
        `Note ${note.archived ? "unarchived" : "archived"} successfully!`
      );
    } catch (err) {
      toast.error(err || "Failed to update archive status.");
    }
  };

  // Bulk delete toggle
  const handleBulkToggle = () => {
    setBulkMode(!bulkMode);
    setSelectedNotes([]); // reset selection
  };

  // Checkbox selection
  const handleCheckboxChange = (id) => {
    setSelectedNotes((prev) =>
      prev.includes(id) ? prev.filter((noteId) => noteId !== id) : [...prev, id]
    );
  };

  // Bulk delete action
  const handleBulkDelete = async () => {
    if (selectedNotes.length === 0) return toast.warn("Select notes to delete");
    if (!window.confirm("Are you sure you want to delete selected notes?"))
      return;

    try {
      await dispatch(bulkRemoveNotes(selectedNotes)).unwrap();
      toast.success("Selected notes deleted successfully!");
      setBulkMode(false);
      setSelectedNotes([]);
    } catch (err) {
      toast.error(err || "Failed to delete notes.");
    }
  };

  // Edit note
  const handleEdit = (note) => {
    setEditNoteData(note);
    setShowAddPopup(true);
  };

  const handleUpdate = async (updatedNote) => {
    try {
      await dispatch(
        editNote({ id: updatedNote.id, note: updatedNote })
      ).unwrap();
      toast.success("Note updated successfully!");
      setShowAddPopup(false);
      setEditNoteData(null);
    } catch (err) {
      toast.error(err || "Failed to update note.");
    }
  };

  // View note
  const handleView = async (id) => {
    setSelectedNoteId(id);
    try {
      await dispatch(getSingleNote(id)).unwrap();
    } catch (err) {
      toast.error(err || "Failed to fetch note.");
    }
  };

  const handleBack = () => setSelectedNoteId(null);

  return (
    <div className={styles.container}>
      {selectedNoteId ? (
        <SingleNoteView note={singleNote} onBack={handleBack} />
      ) : (
        <>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "15px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {/* ✅ Archive toggle button */}
            <button
              className={styles.bulkBtn}
              onClick={() => setShowArchived((prev) => !prev)}
              style={{
                backgroundColor: showArchived ? "#6c757d" : "#ff9800",
                color: "#fff",
              }}
            >
              {showArchived ? "Show Unarchived" : `Archived (${archivedCount})`}
            </button>

            <button
              className={styles.addBtn}
              onClick={() => setShowAddPopup(true)}
            >
              + Add Note (Shift + N)
            </button>

            {notes.length > 0 && (
              <>
                <button
                  className={styles.bulkBtn}
                  onClick={handleBulkToggle}
                  style={{
                    backgroundColor: bulkMode ? "#f44336" : "#2196f3",
                    color: "#fff",
                  }}
                >
                  {bulkMode ? "Cancel Bulk Delete" : "Delete Many"}
                </button>

                {bulkMode && (
                  <button
                    className={styles.bulkBtn}
                    onClick={handleBulkDelete}
                    disabled={selectedNotes.length === 0}
                    style={{
                      backgroundColor:
                        selectedNotes.length > 0 ? "#f44336" : "#ccc",
                      color: "#fff",
                    }}
                  >
                    Delete Selected ({selectedNotes.length})
                  </button>
                )}
              </>
            )}

            {/* ✅ Search box */}
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchBox}
            />
          </div>

          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className={styles.notesList}>
            {displayedNotes.map((note) => (
              <div key={note.id} className={styles.noteCard}>
                {/* Archive button top-left */}
                <div className={styles.tooltipWrapper}>
                  <button
                    className={styles.archiveBtn}
                    onClick={() => handleArchive(note)}
                  >
                    {note.archived ? "📦" : "📂"}
                  </button>
                  <span className={styles.tooltipText}>
                    {note.archived ? "Unarchive" : "Archive"}
                  </span>
                </div>

                <div className={styles.cardContent}>
                  <div>
                    <h3 className={styles.noteTitle}>{note.title}</h3>
                    <p className={styles.noteContent}>
                      {note.content.split(" ").slice(0, 12).join(" ")}
                      {note.content.split(" ").length > 12 ? "..." : ""}
                    </p>
                  </div>

                  <div className={styles.actionsColumn}>
                    {bulkMode ? (
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={selectedNotes.includes(note.id)}
                        onChange={() => handleCheckboxChange(note.id)}
                      />
                    ) : (
                      <>
                        {" "}
                        {/* View */}{" "}
                        <div className={styles.tooltipWrapper}>
                          {" "}
                          <button
                            className={styles.actionBtn}
                            onClick={() => handleView(note.id)}
                          >
                            {" "}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                            >
                              {" "}
                              <g fill="none" stroke="#000" strokeWidth="2">
                                {" "}
                                <circle cx="12" cy="12" r="3" />{" "}
                                <path d="M20.188 10.934c.388.472.582.707.582 1.066s-.194.594-.582 1.066C18.768 14.79 15.636 18 12 18s-6.768-3.21-8.188-4.934c-.388-.472-.582-.707-.582-1.066s.194-.594.582-1.066C5.232 9.21 8.364 6 12 6s6.768 3.21 8.188 4.934Z" />{" "}
                              </g>{" "}
                            </svg>{" "}
                          </button>{" "}
                          <span className={styles.tooltipText}>View</span>{" "}
                        </div>{" "}
                        {/* Edit */}{" "}
                        <div className={styles.tooltipWrapper}>
                          {" "}
                          <button
                            className={styles.actionBtn}
                            onClick={() => handleEdit(note)}
                          >
                            {" "}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                            >
                              {" "}
                              <path
                                fill="#000"
                                d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-1 2q-.425 0-.712-.288T3 20v-2.425q0-.4.15-.763t.425-.637L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.437.65T21 6.4q0 .4-.138.763t-.437.662l-12.6 12.6q-.275.275-.638.425t-.762.15zM19 6.4L17.6 5zm-3.525 2.125l-.7-.725L16.2 9.225z"
                              />{" "}
                            </svg>{" "}
                          </button>{" "}
                          <span className={styles.tooltipText}>Edit</span>{" "}
                        </div>{" "}
                        {/* Delete */}{" "}
                        <div className={styles.tooltipWrapper}>
                          {" "}
                          <button
                            className={styles.actionBtn}
                            onClick={() => handleDelete(note.id)}
                          >
                            {" "}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                            >
                              {" "}
                              <path
                                fill="#000"
                                d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"
                              />{" "}
                            </svg>{" "}
                          </button>{" "}
                          <span className={styles.tooltipText}>Delete</span>{" "}
                        </div>{" "}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showAddPopup && (
        <AddNotePopup
          onClose={() => {
            setShowAddPopup(false);
            setEditNoteData(null);
          }}
          noteData={editNoteData}
          isEdit={!!editNoteData}
          handleUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default AllNotesView;
