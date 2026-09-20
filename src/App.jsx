import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MapView from "./pages/MapView";
import Feed from "./pages/Feed";
import ReportForm from "./pages/ReportForm";
import ReportDetail from "./pages/ReportDetail";

export default function App() {
  return (
    <BrowserRouter basename="/justice">
      <div className="min-h-screen bg-dark-900 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/report" element={<ReportForm />} />
          <Route path="/report/:id" element={<ReportDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
