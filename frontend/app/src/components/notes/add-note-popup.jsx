import React, { useState, useEffect } from "react";
import styles from "./styles/add-note-popup.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addNote } from "../../store/slice/notes-slice";
import { toast } from "react-toastify";

const AddNotePopup = ({ onClose, noteData = null, isEdit = false, handleUpdate }) => {
  const [note, setNote] = useState({ title: "", content: "" });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.notes);

  useEffect(() => {
    if (isEdit && noteData) {
      setNote({ title: noteData.title, content: noteData.content, id: noteData.id });
    }
  }, [isEdit, noteData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!note.title.trim()) newErrors.title = "Title is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      if (isEdit) {
        await handleUpdate(note);
      } else {
        try {
          await dispatch(addNote({ title: note.title, content: note.content })).unwrap();
          toast.success("Note added successfully!");
          onClose();
        } catch (err) {
          toast.error(err.message || "Failed to add note.");
        }
      }
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2 className={styles.heading}>{isEdit ? "Edit Note" : "Add Note"}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={note.title}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.title && <p className={styles.error}>{errors.title}</p>}

          <textarea
            name="content"
            placeholder="Content (optional)"
            value={note.content}
            onChange={handleChange}
            className={styles.textarea}
          />

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancel}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className={styles.save}>
              {loading ? "Saving..." : isEdit ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNotePopup;
