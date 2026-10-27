import { Routes, Route } from "react-router"
import { Dashboard } from "./routes/Dashboard"
import { NewCropPage } from "./routes/NewCropPage"
import { EditCropPage } from "./routes/EditCropPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/new" element={<NewCropPage />} />
      <Route path="/edit/:id" element={<EditCropPage />} />
    </Routes>
  )
}

export default App
