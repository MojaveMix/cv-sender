import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./components/HomePage";
import FormEmailScreen from "./components/FormEmailScreen";
import UpdateEmailScreen from "./components/UpdateEmailScreen";
import UploadFileScreen from "./components/UploadFileScreen";
import UploadDataExcel from "./components/UploadDataExcel";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<FormEmailScreen />} />
        <Route path="/upload/cv" element={<UploadFileScreen />} />
        <Route path="/update/:id" element={<UpdateEmailScreen />} />
        <Route path="/upload/excel" element={<UploadDataExcel />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
