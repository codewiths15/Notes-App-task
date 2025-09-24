import { Provider } from "react-redux";
import Router from "./routes/sections";
import store from "./store/store";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Provider store={store}>
        <ToastContainer position="top-right" autoClose={3000} />
        <Router />
      </Provider>
    </>
  );
}

export default App;
