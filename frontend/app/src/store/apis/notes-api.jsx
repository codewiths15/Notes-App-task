import API from "./api-main";

export const fetchNotes = async (page = 1, pageSize = 10) => {
  const res = await API.get(`/api/notes?page=${page}&pageSize=${pageSize}`);
  return res.data.data;
};

export const createNote = async (note) => {
  const res = await API.post("/api/notes", note);
  return res.data.data;
};

export const updateNote = async (id, note) => {
  const res = await API.put(`/api/notes/${id}`, note);
  return res.data.data;
};

export const deleteNote = async (id) => {
  const res = await API.delete(`/api/notes/${id}`);
  return res.data;
};

export const fetchSingleNote = async (id) => {
  const res = await API.get(`/api/notes/${id}`);
  return res.data.data;
};

// Bulk delete notes
export const bulkDeleteNotes = async (ids) => {
  const res = await API.put("/api/notes/bulk-delete", { ids });
  return res.data;
};

export const toggleArchiveNote = async (id, archived) => {
  const res = await API.put(`/api/notes/archive/${id}`, { archived });
  return res.data.data;
};
