// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: "/auth",
};

// ----------------------------------------------------------------------

export const paths = {
  // AUTH
  auth: {
    login: `${ROOTS.AUTH}/login`,
  },
  // DASHBOARD
  dashboard: {
    notes: {
      root: "/notes",
      single_note: (id) => `/notes/${id}`,
    },
  },
};
