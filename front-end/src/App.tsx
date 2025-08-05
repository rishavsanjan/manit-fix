import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Header from "./components/Header"
import HomePage from "./components/HomePage"
import ReportUpload from "./components/ReportUpload";
import Login from "./components/Login"
import Posts from "./components/Posts";
import PostDetail from "./components/PostDetail";
import Footer from "./components/Footer";
import Features from "./components/Features";
import MyProfile from "./components/MyProfile";
function App() {

  function AppContent() {
    return (
      <>
        <Header />
        <Routes>
          <Route path="/report-upload" element={<ReportUpload />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:postId" element={<PostDetail />} />
          <Route path="/features" element={<Features />} />
          <Route path="/my-profile" element={<MyProfile />} />
        </Routes>
        <Footer />
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
