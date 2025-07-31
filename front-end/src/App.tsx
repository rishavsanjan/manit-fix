import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Header from "./components/Header"
import HomePage from "./components/HomePage"
import ReportUpload from "./components/ReportUpload";
import Login from "./components/Login"
import Posts from "./components/Posts";
function App() {

  function AppContent() {
    return (
      <>
        <Header />
        <Routes>
          <Route path="/report-upload" element={<ReportUpload />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/posts" element={<Posts/>} />
        </Routes>
      </>

    )
  }

  return (
    <>
      <Router>
        <AppContent />
      </Router>
    </>
  )
}

export default App
