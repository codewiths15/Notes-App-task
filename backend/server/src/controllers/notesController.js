import prisma from "../config/prisma.js";

// Create note
export const createNote = async (req, res) => {
  const { title, content } = req.body;
  try {
    const note = await prisma.note.create({
      data: { title, content, userId: req.userId },
    });
    res.status(201).json({
      status: "success",
      data: note,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// List notes (only user's notes)
export const listNotes = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  try {
    // Count total notes for the user
    const totalNotes = await prisma.note.count({
      where: { userId: req.userId, deleted: false },
    });

    // Fetch paginated notes
    const notes = await prisma.note.findMany({
      where: { userId: req.userId, deleted: false },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      status: "success",
      data: {
        notes,
        pagination: {
          totalNotes,
          totalPages: Math.ceil(totalNotes / pageSize),
          currentPage: page,
          pageSize,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Get Single Note
export const getNoteById = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await prisma.note.findFirst({
      where: { id: parseInt(id), deleted: false },
      select: { title: true, content: true },
    });

    if (!note) {
      return res
        .status(404)
        .json({ status: "error", message: "Note not found" });
    }

    res.status(200).json({ status: "success", data: note });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Update note
export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  // Validation: title is mandatory
  if (!title || title.trim() === "") {
    return res.status(400).json({
      status: "error",
      message: "Title is required",
    });
  }

  try {
    const note = await prisma.note.update({
      where: { id: parseInt(id) },
      data: { title, content },
    });

    res.status(200).json({
      status: "success",
      data: note,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Soft delete note
export const deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.note.update({
      where: { id: parseInt(id) },
      data: { deleted: true },
    });

    res.status(200).json({
      status: "success",
      message: "Note deleted",
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Bulk soft delete notes
export const bulkDeleteNotes = async (req, res) => {
  const { ids } = req.body; // Array of note IDs

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({
      status: "error",
      message: "Please provide an array of note IDs to delete",
    });
  }

  try {
    await prisma.note.updateMany({
      where: {
        id: { in: ids.map((id) => parseInt(id)) },
        deleted: false,
      },
      data: { deleted: true },
    });

    res.status(200).json({
      status: "success",
      message: `${ids.length} notes deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Toggle archive/unarchive
export const toggleArchiveNote = async (req, res) => {
  const { id } = req.params;
  const { archived } = req.body; // true = archive, false = unarchive

  if (archived === undefined) {
    return res.status(400).json({ status: "error", message: "archived field is required" });
  }

  try {
    const note = await prisma.note.update({
      where: { id: parseInt(id) },
      data: { archived },
    });

    res.status(200).json({
      status: "success",
      message: archived ? "Note archived" : "Note unarchived",
      data: note,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
