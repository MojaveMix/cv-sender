import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./components/HomePage";
import FormEmailScreen from "./components/FormEmailScreen";
import UpdateEmailScreen from "./components/UpdateEmailScreen";
import UploadFileScreen from "./components/UploadFileScreen";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<FormEmailScreen />} />
        <Route path="/upload/cv" element={<UploadFileScreen />} />
        <Route path="/update/:id" element={<UpdateEmailScreen />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
