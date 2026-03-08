import { BrowserRouter,Routes,Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Profile from "./pages/Profile"
import ResumeUpload from "./pages/ResumeUpload"

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App(){

  return(

    <BrowserRouter>

      <Navbar/>

      <Routes>

        <Route path="/" element={<Profile/>}/>
        <Route path="/upload" element={<ResumeUpload/>}/>

      </Routes>

      <ToastContainer position="top-center" />

    </BrowserRouter>

  );

}

export default App