import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ExampleMongoHookup from "./pages/exampleMongoHookup.jsx";
import Profile from "./pages/ProfilePage.jsx";
import InputUserPage from "./pages/userInput.jsx";
import MyEventsOrganizer from "./pages/MyEventsOrganizer.jsx";
import ModifyEvent from "./pages/modifyEvent.jsx";
import Login from "./pages/Login.jsx";
import VolunteerSignUp from "./pages/VolunteerSignUp.jsx";
import LandingPage from "./pages/landingPage.jsx";
import OrganizerSignUp from "./pages/OrganizerSignUp.jsx";
import EventsCalendar from "./pages/EventsCalendar.jsx";
import EventDetails from "./pages/EventDetails.jsx";   // 🔥 NEW
import MyEventsVolunteer from "./pages/MyEventsVolunteer.jsx";
import EventsSearch from "./pages/EventsSearch.jsx";
import ReviewApplicants from "./pages/ReviewApplicants.jsx";
import TagsPage from "./pages/TagsPage.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";   // 🔥 NEW
import ResetPassword from "./pages/ResetPassword.jsx";      // 🔥 NEW


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/exampleMongoHookup" element={<ExampleMongoHookup />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/userInput" element={<InputUserPage />} />
      <Route path="/modifyEvent" element={<ModifyEvent />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/MyEventsOrganizer" element={<MyEventsOrganizer />} />
      <Route path="/VolunteerSignUp" element={<VolunteerSignUp />} />
      <Route path="/landingPage" element={<LandingPage />} />
      <Route path="/OrganizerSignUp" element={<OrganizerSignUp />} />
      <Route path="/calendar" element={<EventsCalendar />} />
      <Route path="/MyEventsVolunteer" element={<MyEventsVolunteer />} />
      <Route path="/events/search" element={<EventsSearch />} />
      <Route path="/tags" element={<TagsPage />} />
      {/* NEW EVENT DETAILS ROUTE */}
      <Route path="/event/:id" element={<EventDetails />} />
      <Route path="/event/:id/applicants" element={<ReviewApplicants />} />
      {/* 🔥 NEW PASSWORD RECOVERY ROUTES */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}
