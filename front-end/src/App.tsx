import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";


import Header from "./components/Header"
import HomePage from "./components/HomePage"
import ReportUpload from "./components/ReportUpload";
import Login from "./components/Login"
import Posts from "./components/Posts";
import PostDetail from "./components/PostDetail";
import Footer from "./components/Footer";
import Features from "./components/Features";
import MyProfile from "./components/MyProfile";
import Admin from "./components/Admin";
import AdminIssues from "./components/AdminIssues";
import AdminPostDetail from "./components/AdminPostDetail";
function App() {
  


  function AppContent() {
    const location = useLocation();
    const hideHeaderRoutes = ["/admin"];
    const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);
    return (
      <>
        {!shouldHideHeader && <Header />}
        <Routes>
          <Route path="/report-upload" element={<ReportUpload />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:postId" element={<PostDetail />} />
          <Route path="/features" element={<Features />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin-issues" element={<AdminIssues />} />
          <Route path="/admin/issue-detail/:postId" element={<AdminPostDetail />} />
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
