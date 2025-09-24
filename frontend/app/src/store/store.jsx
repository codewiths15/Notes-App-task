import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/user-slice";
import noteReducer from "./slice/notes-slice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    notes:noteReducer
    
  },
});

export default store;
