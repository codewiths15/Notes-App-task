import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as notesAPI from "../apis/notes-api";

// Async thunks
export const getNotes = createAsyncThunk(
  "notes/getNotes",
  async ({ page, pageSize }, { rejectWithValue }) => {
    try {
      const notes = await notesAPI.fetchNotes(page, pageSize);
      return notes;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch notes");
    }
  }
);

export const addNote = createAsyncThunk(
  "notes/addNote",
  async (note, { rejectWithValue }) => {
    try {
      const newNote = await notesAPI.createNote(note);
      return newNote;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create note");
    }
  }
);

export const editNote = createAsyncThunk(
  "notes/editNote",
  async ({ id, note }, { rejectWithValue }) => {
    try {
      const updatedNote = await notesAPI.updateNote(id, note);
      return updatedNote;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update note");
    }
  }
);

export const removeNote = createAsyncThunk(
  "notes/removeNote",
  async (id, { rejectWithValue }) => {
    try {
      await notesAPI.deleteNote(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete note");
    }
  }
);

export const getSingleNote = createAsyncThunk(
  "notes/getSingleNote",
  async (id, { rejectWithValue }) => {
    try {
      const note = await notesAPI.fetchSingleNote(id); // you'll need to add fetchSingleNote in your api
      return note;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch note");
    }
  }
);

export const bulkRemoveNotes = createAsyncThunk(
  "notes/bulkRemoveNotes",
  async (ids, { rejectWithValue }) => {
    try {
      const res = await notesAPI.bulkDeleteNotes(ids);
      return ids; // return the IDs to remove from state
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete notes");
    }
  }
);

export const archiveNote = createAsyncThunk(
  "notes/archiveNote",
  async ({ id, archived }, { rejectWithValue }) => {
    try {
      const note = await notesAPI.toggleArchiveNote(id, archived);
      return note;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update note");
    }
  }
);

const initialState = {
  notes: [],
  single_note: null,
  loading: false,
  error: null,
  pagination: {
    totalNotes: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
  },
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Notes
      .addCase(getNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload.notes;
        state.pagination = action.payload.pagination;
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Note
      .addCase(addNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes.unshift(action.payload);
      })
      .addCase(addNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit Note
      .addCase(editNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editNote.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notes.findIndex((n) => n.id === action.payload.id);
        if (index !== -1) state.notes[index] = action.payload;
      })
      .addCase(editNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove Note
      .addCase(removeNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = state.notes.filter((n) => n.id !== action.payload);
      })
      .addCase(removeNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getSingleNote.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.single_note = null;
      })
      .addCase(getSingleNote.fulfilled, (state, action) => {
        state.loading = false;
        state.single_note = action.payload;
      })
      .addCase(getSingleNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.single_note = null;
      })

      .addCase(bulkRemoveNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkRemoveNotes.fulfilled, (state, action) => {
        state.loading = false;
        // Remove notes from state
        state.notes = state.notes.filter(
          (note) => !action.payload.includes(note.id)
        );
      })
      .addCase(bulkRemoveNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(archiveNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(archiveNote.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notes.findIndex((n) => n.id === action.payload.id);
        if (index !== -1) state.notes[index] = action.payload;
        // Update single_note if currently viewed
        if (state.single_note?.id === action.payload.id) {
          state.single_note = action.payload;
        }
      })
      .addCase(archiveNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default notesSlice.reducer;
