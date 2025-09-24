import React from "react";
import styles from "./styles/single-note-view.module.css";

const SingleNoteView = ({ note, onBack }) => {
  if (!note) return <p>Loading note...</p>;

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={onBack}>
        &larr; Back
      </button>
      <h2 className={styles.title}>{note.title}</h2>
      <p className={styles.content}>{note.content}</p>
    </div>
  );
};

export default SingleNoteView;
