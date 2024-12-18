import "./App.css";
import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageLayout from "@/components/layouts/PageLayout";

import { AuthProvider } from "@/context/AuthContext";

import FamilyDataProvider from "@/context/FamilyDataContext";
import PetTimelineProvider from "@/context/PetTimelineContext";
import LocationTimelineProvider from "@/context/LocationTimelineContext";

import WelcomePage from "@/pages/WelcomePage";
import ProtectedRoute from "@/pages/app/AppDataProtected";
import AppLayout from "@/pages/app/AppLayout";
import LogoutPage from "@/pages/LogoutPage";
import ProfilePage from "@/pages/app/ProfilePage";

import TimelinePage from "@/pages/app/family/FamilyTimelinePage";
import FamilySelectPage from "@/pages/app/FamilySelectPage";
import FamilyData from "@/pages/app/family/FamilyDataPage";
import FamilyFormPage from "@/pages/app/family/FamilyFormPage";

import PetInfo from "@/pages/app/family/pet/PetDetailPage";
import PetFormPage from "@/pages/app/family/pet/PetFormPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLayout isLoading>Loading...</PageLayout>}>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route
              path="/app"
              element={
                <FamilyDataProvider>
                  <PetTimelineProvider>
                    <LocationTimelineProvider>
                      <ProtectedRoute />
                    </LocationTimelineProvider>
                  </PetTimelineProvider>
                </FamilyDataProvider>
              }
            >
              <Route element={<AppLayout />}>
                <Route path="data" element={<FamilyData />} />
                <Route index element={<FamilySelectPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="family/:familyId">
                  <Route index element={<TimelinePage />} />
                  <Route path="pet/:petId?" element={<PetInfo />} />
                  <Route path="pet/:petId/edit" element={<PetFormPage />} />
                  <Route path="data" element={<FamilyData />} />
                  <Route path="edit" element={<FamilyFormPage />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
