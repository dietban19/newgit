import { Route, Routes } from "react-router-dom";
import {useState, useHistory} from 'react'
import Empty from "./components/Empty";
import Layout from "./components/Layout";
import Obituary from "./components/Obituary";

function App() {
  const [obituaries, setObituaries] = useState([]);
  // const history = useHistory();

  // useEffect(() => {
  //   const path = window.location.pathname;
  //   if (path === "/obituaries") {
  //     history.push("/");
  //   }
  // }, [history]);
  return (
    <Routes>
      <Route
        element={<Layout obituaries={obituaries} setObituaries={setObituaries} />}
      >
        <Route path="/" element={<Empty />} />
        <Route path="*" element={<Empty />} />
        <Route
          path="/obituaries"
          element={<Obituary obituaries={obituaries} />}
        />
      </Route>
    </Routes>
  );
}

export default App;
