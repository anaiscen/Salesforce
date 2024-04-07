import { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import TermsAndConditionsOfUse from "./pages/policies/TermsAndConditionsOfUse";
import LegalNotice from "./pages/policies/LegalNotice";
import PrivacyPolicy from "./pages/policies/PrivacyPolicy";
import CookiePolicy from "./pages/policies/CookiePolicy";
import Entreprise from "./pages/Entreprise";
import AddCompany from "./pages/AddCompany";
import Idea from "./pages/Idea";
import Navbar from "./components/navbar/Navbar";
import UserProvider from "./contexts/UserContext";
import Login from "./components/login/Login";
import IdeaContent from "./components/ideaContent/IdeaContent";
import Profile from "./pages/Profile";
import UserEditPage from "./pages/UserEditPage";
import UserAddPage from "./pages/UserAddPage";
import ListUser from "./components/userManager/ListUser";
import "./App.css";
import "./utils/style/index.scss";
import ForgottenPassword from "./pages/ForgottenPassword";
import UpdatePassword from "./pages/UpdatePassword";
import Footer from "./components/footer/Footer";
import AddFirstUser from "./components/userManager/AddFirstUser";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  return (
    <div className="App">
      <UserProvider>
        {loggedIn ? (
          <div>
            <Navbar />
            <Routes>
              <Route path="/" element={<Entreprise />} />
              <Route path="/user/company/:companyId" element={<ListUser />} />
              <Route path="/idea" element={<Idea />} />
              <Route path="/idea/:id" element={<IdeaContent />} />
              <Route path="/profil" element={<Profile />} />
              <Route path="/profil/:id" element={<Profile />} />
              <Route path="/user/:id" element={<UserEditPage />} />
              <Route path="/user/add" element={<UserAddPage />} />
              <Route path="/addFirstUser" element={<AddFirstUser />} />
              <Route path="/register" element={<AddCompany />} />
              <Route path="/register/:id" element={<Entreprise />} />
              <Route path="/politiqueCookies" element={<CookiePolicy />} />
              <Route path="/mentionsLegales" element={<LegalNotice />} />
              <Route
                path="/politiqueDeConfidentialité"
                element={<PrivacyPolicy />}
              />
              <Route
                path="/conditionsGénéralesUtilisation"
                element={<TermsAndConditionsOfUse />}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <Footer />
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Login handleLogin={handleLogin} />} />
            <Route path="/resetPassword" element={<ForgottenPassword />} />
            <Route path="/setNewPassword/:token" element={<UpdatePassword />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </UserProvider>
    </div>
  );
}

export default App;
