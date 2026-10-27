import { Routes, Route } from "react-router"
import { Dashboard } from "./routes/Dashboard"
import { NewCropPage } from "./routes/NewCropPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/new" element={<NewCropPage />} />
    </Routes>
  )
}

export default App
