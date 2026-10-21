import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import AdminPage from "./pages/admin/adminPage";

function App() {

  return (
    <>
      <Routes>
        <Route path="/*" element={<HomePage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/admin/*" element={<AdminPage/>} />
      </Routes>
    </>
  )
}
export default App;