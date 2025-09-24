import React, { useEffect, useState } from "react";
import styles from "../styles/notes-main-view.module.css";
import AllNotesView from "../all-notes-view";
import { useSelector, useDispatch } from "react-redux";
import { getNotes } from "../../../store/slice/notes-slice";
import { logout } from "../../../store/slice/user-slice";
import { useNavigate } from "react-router-dom";
import { paths } from "../../../routes/paths";

const NotesMainView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notes, loading, pagination } = useSelector((state) => state.notes);
  const [page, setPage] = useState(1);

  const limit = pagination.pageSize;

  useEffect(() => {
    dispatch(getNotes({ page, pageSize: limit }));
  }, [dispatch, page, limit]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < pagination.totalPages) setPage(page + 1);
  };

  const handleLogout = () => {
    dispatch(logout()); // 🔹 clear Redux + localStorage
    navigate(paths.auth.login); // 🔹 redirect to login page
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>My Notes</h1>
        <div className={styles.userBox}>
          <span className={styles.userEmail}>user@example.com</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
        </div>
      </header>

      {/* Notes List Container */}
      <main className={styles.notesWrapper}>
        <AllNotesView notes={notes} loading={loading} />
      </main>

      {/* Pagination Controls */}
      <footer className={styles.pagination}>
        <button onClick={handlePrev} disabled={page === 1}>
          ◀ Prev
        </button>
        <span style={{ color: "black" }}>
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button onClick={handleNext} disabled={page === pagination.totalPages}>
          Next ▶
        </button>
      </footer>
    </div>
  );
};

export default NotesMainView;
