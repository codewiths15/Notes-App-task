import express from "express";
import protect from "../middleware/protect.js";
import {
  createNote,
  listNotes,
  updateNote,
  deleteNote,
  getNoteById,
  bulkDeleteNotes,
  toggleArchiveNote,
} from "../controllers/notesController.js";

const router = express.Router();

router.use(protect);

router.post("/", createNote);
router.get("/", listNotes);
router.get("/:id", getNoteById);
router.put("/bulk-delete", bulkDeleteNotes);
router.put("/archive/:id", toggleArchiveNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
