import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { SignUp } from "./components/SignUp";
import { Dashboard } from "./components/Dashboard";
import { NoActivePlan } from "./components/NoActivePlan";
import { AppBetterPopup } from "./components/AppBetterPopup";
import { SelfCareResources } from "./components/SelfCareResources";
import { WomenWellnessSelfCare } from "./components/WomenWellnessSelfCare";
import { PainAreas } from "./components/PainAreas";
import { TasksPage } from "./components/TasksPage";
import { AppointmentsPage } from "./components/AppointmentsPage";
import { InsightsPage } from "./components/InsightsPage";
import { BillingPage } from "./components/BillingPage";
import { ReferEarnPage } from "./components/ReferEarnPage";
import { FeedbackPage } from "./components/FeedbackPage";
import { SupportPage } from "./components/SupportPage";
import { CareTeam } from "./components/CareTeam";
import { CareTeamHistory } from "./components/CareTeamHistory";
import { ProfilePage } from "./components/ProfilePage";
import { MindfulnessPage } from "./components/MindfulnessPage";
import { OCDPage } from "./components/OCDPage";
import { Hotline } from "./components/Hotline";
import { EmergencyDoctors } from "./components/EmergencyDoctors";
import { MindfulnessSelfCare } from "./components/MindfulnessSelfCare";
import { OCDSelfCare } from "./components/OCDSelfCare";
import { HealthOCDPage } from "./components/HealthOCDPage";
import { HoardingOCDPage } from "./components/HoardingOCDPage";
import { CompulsiveHoardingArticle } from "./components/CompulsiveHoardingArticle";
import { HoardingDisorderArticle } from "./components/HoardingDisorderArticle";
import { OCDSymptomArticle } from "./components/OCDSymptomArticle";
import { HoardingPhenotypeArticle } from "./components/HoardingPhenotypeArticle";
import { HoardingControversiesArticle } from "./components/HoardingControversiesArticle";
import { LifeBeyondPilesStory } from "./components/LifeBeyondPilesStory";
import { JoanTeacherStory } from "./components/JoanTeacherStory";
import { JeanneLeierStory } from "./components/JeanneLeierStory";
import { ThatHoarderStory } from "./components/ThatHoarderStory";
import { BrainBehindHoardingStory } from "./components/BrainBehindHoardingStory";
import { TrichotillomaniaPage } from "./components/TrichotillomaniaPage";
import { TrichMyth1 } from "./components/TrichMyth1";
import { TrichMyth2 } from "./components/TrichMyth2";
import { TrichMyth3 } from "./components/TrichMyth3";
import { TrichMyth4 } from "./components/TrichMyth4";
import { TrichMyth5 } from "./components/TrichMyth5";
import { TrichArticle1 } from "./components/TrichArticle1";
import { TrichArticle2 } from "./components/TrichArticle2";
import { TrichArticle3 } from "./components/TrichArticle3";
import { TrichArticle4 } from "./components/TrichArticle4";
import { TrichArticle5 } from "./components/TrichArticle5";
import { ContaminationOCDPage } from "./components/ContaminationOCDPage";
import { ContaminationTip1 } from "./components/ContaminationTip1";
import { ContaminationTip2 } from "./components/ContaminationTip2";
import { ContaminationTip3 } from "./components/ContaminationTip3";
import { ContaminationTip4 } from "./components/ContaminationTip4";
import { ContaminationTip5 } from "./components/ContaminationTip5";
import { ContaminationArticle1 } from "./components/ContaminationArticle1";
import { ContaminationArticle2 } from "./components/ContaminationArticle2";
import { ContaminationArticle3 } from "./components/ContaminationArticle3";
import { ContaminationArticle4 } from "./components/ContaminationArticle4";
import { ContaminationArticle5 } from "./components/ContaminationArticle5";
import { PureOOCDPage } from "./components/PureOOCDPage";
import { PureOArticle1 } from "./components/PureOArticle1";
import { PureOArticle2 } from "./components/PureOArticle2";
import { PureOArticle3 } from "./components/PureOArticle3";
import { PureOArticle4 } from "./components/PureOArticle4";
import { PureOArticle5 } from "./components/PureOArticle5";
import { PureOStory1 } from "./components/PureOStory1";
import { PureOStory2 } from "./components/PureOStory2";
import { PureOStory3 } from "./components/PureOStory3";
import { PureOStory4 } from "./components/PureOStory4";
import { PureOStory5 } from "./components/PureOStory5";
import { LGBTQSelfCare } from "./components/LGBTQSelfCare";
import { LGBTQTips } from "./components/LGBTQTips";
import { FindYourCommunity } from "./components/FindYourCommunity";
import { SetGentleBoundaries } from "./components/SetGentleBoundaries";
import { HonorYourIdentity } from "./components/HonorYourIdentity";
import { AffirmingSelfTalk } from "./components/AffirmingSelfTalk";
import { CreateSafeSpaces } from "./components/CreateSafeSpaces";
import { ProcessGriefLoss } from "./components/ProcessGriefLoss";
import { LGBTQMythsFacts } from "./components/LGBTQMythsFacts";
import { LGBTQMythDetail } from "./components/LGBTQMythDetail";
import { LGBTQArticles } from "./components/LGBTQArticles";
import { LGBTQArticleDetail } from "./components/LGBTQArticleDetail";
import { LesbianGuide } from "./components/LesbianGuide";
import { GayGuide } from "./components/GayGuide";
import { BisexualGuide } from "./components/BisexualGuide";
import { TransGuide } from "./components/TransGuide";
import { DepressionPage } from "./components/DepressionPage";
import { ExercisePlans } from "./components/ExercisePlans";
import { ExerciseDetails } from "./components/ExerciseDetails";
import { ServicePage } from "./components/ServicePage";
import { ProviderProfile } from "./components/ProviderProfile";
import { Journal } from "./components/Journal";
import { JournalNew } from "./components/JournalNew";
import { PlansPage } from "./components/PlansPage";
import { TherapyPlansPage } from "./components/TherapyPlansPage";
import { DiabetesAcademy } from "./components/DiabetesAcademy";
import { HypertensionAcademy } from "./components/HypertensionAcademy";
import { CoachingAreas } from "./components/CoachingAreas";
import { FitnessSelfCare } from "./components/FitnessSelfCare";
import { NutritionSelfCare } from "./components/NutritionSelfCare";
import { YogaSelfCare } from "./components/YogaSelfCare";
import { SubstanceUseSelfCare } from "./components/SubstanceUseSelfCare";
import { DeaddictionPage } from "./components/DeaddictionPage";
import { FinancialWellnessSelfCare } from "./components/FinancialWellnessSelfCare";
import { CategoriesPage } from "./components/CategoriesPage";
import { SubcategoryPage } from "./components/SubcategoryPage";
import { TimePage } from "./components/TimePage";
import { MeditationDetailPage } from "./components/MeditationDetailPage";
import { LifeIsKindDetailPage } from "./components/LifeIsKindDetailPage";
import { BrowseByGoalDetail } from "./components/BrowseByGoalDetail";
import { SeeAllPage } from "./components/SeeAllPage";
import { CollectionDetailPage } from "./components/CollectionDetailPage";
import { DailyProgramPage } from "./components/DailyProgramPage";
import { ChatPage } from "./components/ChatPage";
import { CheckoutPage } from "./components/CheckoutPage";
import { HealthChecksPackages } from "./components/HealthChecksPackages";
import { DiagnosticTests } from "./components/DiagnosticTests";
import { MedicinesPharmacy } from "./components/MedicinesPharmacy";
import { PrescriptionRefill } from "./components/PrescriptionRefill";
import { MedicalRecords } from "./components/MedicalRecords";

function App() {
  const [showAppPopup, setShowAppPopup] = useState(false);

  useEffect(() => {
    // Check if user is logged in and should see the popup
    const userString = localStorage.getItem("mantraUser");
    if (userString) {
      const user = JSON.parse(userString);
      if (user.showAppPopup !== false) {
        setShowAppPopup(true);
      }
    }
  }, []);

  const handleClosePopup = () => {
    setShowAppPopup(false);
  };

  return (
    <BrowserRouter basename="/coach">
      {showAppPopup && <AppBetterPopup onClose={handleClosePopup} />}
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/no-plan"
          element={
            <ProtectedRoute>
              <NoActivePlan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/self-care"
          element={
            <ProtectedRoute>
              <SelfCareResources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/women-wellness-self-care"
          element={
            <ProtectedRoute>
              <WomenWellnessSelfCare />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pain-areas"
          element={
            <ProtectedRoute>
              <PainAreas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <AppointmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/insights"
          element={
            <ProtectedRoute>
              <InsightsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <BillingPage />
            </ProtectedRoute>
          }
        />
        {/* Legacy redirects */}
        <Route path="/subscription" element={<Navigate to="/billing" replace />} />
        <Route path="/orders"       element={<Navigate to="/billing" replace />} />
        <Route
          path="/refer"
          element={
            <ProtectedRoute>
              <ReferEarnPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <FeedbackPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support"
          element={
            <ProtectedRoute>
              <SupportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/care-team"
          element={
            <ProtectedRoute>
              <CareTeam />
            </ProtectedRoute>
          }
        />
        <Route
          path="/care-team-history"
          element={
            <ProtectedRoute>
              <CareTeamHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/service/meditation"
          element={
            <ProtectedRoute>
              <MindfulnessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ocd"
          element={
            <ProtectedRoute>
              <OCDPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hotline"
          element={
            <ProtectedRoute>
              <Hotline />
            </ProtectedRoute>
          }
        />
        <Route
          path="/emergency-doctors"
          element={
            <ProtectedRoute>
              <EmergencyDoctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mindfulness-self-care"
          element={
            <ProtectedRoute>
              <MindfulnessSelfCare />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ocd-self-care"
          element={
            <ProtectedRoute>
              <OCDSelfCare />
            </ProtectedRoute>
          }
        />
        <Route
          path="/health-ocd"
          element={
            <ProtectedRoute>
              <HealthOCDPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hoarding-ocd"
          element={
            <ProtectedRoute>
              <HoardingOCDPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/compulsive-hoarding-article"
          element={
            <ProtectedRoute>
              <CompulsiveHoardingArticle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hoarding-disorder-article"
          element={
            <ProtectedRoute>
              <HoardingDisorderArticle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ocd-symptom-article"
          element={
            <ProtectedRoute>
              <OCDSymptomArticle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hoarding-phenotype-article"
          element={
            <ProtectedRoute>
              <HoardingPhenotypeArticle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hoarding-controversies-article"
          element={
            <ProtectedRoute>
              <HoardingControversiesArticle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/life-beyond-piles-story"
          element={
            <ProtectedRoute>
              <LifeBeyondPilesStory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/joan-teacher-story"
          element={
            <ProtectedRoute>
              <JoanTeacherStory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jeanne-leier-story"
          element={
            <ProtectedRoute>
              <JeanneLeierStory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/that-hoarder-story"
          element={
            <ProtectedRoute>
              <ThatHoarderStory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brain-behind-hoarding-story"
          element={
            <ProtectedRoute>
              <BrainBehindHoardingStory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trichotillomania"
          element={
            <ProtectedRoute>
              <TrichotillomaniaPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trich-myth-1"
          element={
            <ProtectedRoute>
              <TrichMyth1 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trich-myth-2"
          element={
            <ProtectedRoute>
              <TrichMyth2 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trich-myth-3"
          element={
            <ProtectedRoute>
              <TrichMyth3 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trich-myth-4"
          element={
            <ProtectedRoute>
              <TrichMyth4 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trich-myth-5"
          element={
            <ProtectedRoute>
              <TrichMyth5 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trich-article-1"
          element={
            <ProtectedRoute>
              <TrichArticle1 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trich-article-2"
          element={
            <ProtectedRoute>
              <TrichArticle2 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trich-article-3"
          element={
            <ProtectedRoute>
              <TrichArticle3 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trich-article-4"
          element={
            <ProtectedRoute>
              <TrichArticle4 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trich-article-5"
          element={
            <ProtectedRoute>
              <TrichArticle5 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contamination-ocd"
          element={
            <ProtectedRoute>
              <ContaminationOCDPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contamination-tip-1"
          element={
            <ProtectedRoute>
              <ContaminationTip1 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contamination-tip-2"
          element={
            <ProtectedRoute>
              <ContaminationTip2 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contamination-tip-3"
          element={
            <ProtectedRoute>
              <ContaminationTip3 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contamination-tip-4"
          element={
            <ProtectedRoute>
              <ContaminationTip4 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contamination-tip-5"
          element={
            <ProtectedRoute>
              <ContaminationTip5 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contamination-article-1"
          element={
            <ProtectedRoute>
              <ContaminationArticle1 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contamination-article-2"
          element={
            <ProtectedRoute>
              <ContaminationArticle2 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contamination-article-3"
          element={
            <ProtectedRoute>
              <ContaminationArticle3 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contamination-article-4"
          element={
            <ProtectedRoute>
              <ContaminationArticle4 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contamination-article-5"
          element={
            <ProtectedRoute>
              <ContaminationArticle5 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pure-o-ocd"
          element={
            <ProtectedRoute>
              <PureOOCDPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pure-o-article-1"
          element={
            <ProtectedRoute>
              <PureOArticle1 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pure-o-article-2"
          element={
            <ProtectedRoute>
              <PureOArticle2 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pure-o-article-3"
          element={
            <ProtectedRoute>
              <PureOArticle3 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pure-o-article-4"
          element={
            <ProtectedRoute>
              <PureOArticle4 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pure-o-article-5"
          element={
            <ProtectedRoute>
              <PureOArticle5 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pure-o-story-1"
          element={
            <ProtectedRoute>
              <PureOStory1 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pure-o-story-2"
          element={
            <ProtectedRoute>
              <PureOStory2 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pure-o-story-3"
          element={
            <ProtectedRoute>
              <PureOStory3 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pure-o-story-4"
          element={
            <ProtectedRoute>
              <PureOStory4 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pure-o-story-5"
          element={
            <ProtectedRoute>
              <PureOStory5 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lgbtq-self-care"
          element={
            <ProtectedRoute>
              <LGBTQSelfCare />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lgbtq-tips"
          element={
            <ProtectedRoute>
              <LGBTQTips />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lgbtq-myths-facts"
          element={
            <ProtectedRoute>
              <LGBTQMythsFacts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lgbtq-myth/:mythId"
          element={
            <ProtectedRoute>
              <LGBTQMythDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lgbtq-articles"
          element={
            <ProtectedRoute>
              <LGBTQArticles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lgbtq-article/:articleId"
          element={
            <ProtectedRoute>
              <LGBTQArticleDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lesbian-guide"
          element={
            <ProtectedRoute>
              <LesbianGuide />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gay-guide"
          element={
            <ProtectedRoute>
              <GayGuide />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bisexual-guide"
          element={
            <ProtectedRoute>
              <BisexualGuide />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trans-guide"
          element={
            <ProtectedRoute>
              <TransGuide />
            </ProtectedRoute>
          }
        />
        <Route
          path="/find-your-community"
          element={
            <ProtectedRoute>
              <FindYourCommunity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/set-gentle-boundaries"
          element={
            <ProtectedRoute>
              <SetGentleBoundaries />
            </ProtectedRoute>
          }
        />
        <Route
          path="/honor-your-identity"
          element={
            <ProtectedRoute>
              <HonorYourIdentity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/affirming-self-talk"
          element={
            <ProtectedRoute>
              <AffirmingSelfTalk />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-safe-spaces"
          element={
            <ProtectedRoute>
              <CreateSafeSpaces />
            </ProtectedRoute>
          }
        />
        <Route
          path="/process-grief-loss"
          element={
            <ProtectedRoute>
              <ProcessGriefLoss />
            </ProtectedRoute>
          }
        />
        <Route
          path="/depression"
          element={
            <ProtectedRoute>
              <DepressionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exercise-plans"
          element={
            <ProtectedRoute>
              <ExercisePlans />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exercise-details/:exerciseId"
          element={
            <ProtectedRoute>
              <ExerciseDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/service/:serviceId"
          element={
            <ProtectedRoute>
              <ServicePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider-profile/:providerId"
          element={
            <ProtectedRoute>
              <ProviderProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/journal"
          element={
            <ProtectedRoute>
              <Journal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/journal-new"
          element={
            <ProtectedRoute>
              <JournalNew />
            </ProtectedRoute>
          }
        />
        <Route
          path="/journal/:id"
          element={
            <ProtectedRoute>
              <JournalNew />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plans"
          element={
            <ProtectedRoute>
              <PlansPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/therapy-plans"
          element={
            <ProtectedRoute>
              <TherapyPlansPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diabetes-academy"
          element={
            <ProtectedRoute>
              <DiabetesAcademy />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hypertension-academy"
          element={
            <ProtectedRoute>
              <HypertensionAcademy />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coaching-areas"
          element={
            <ProtectedRoute>
              <CoachingAreas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fitness-self-care"
          element={
            <ProtectedRoute>
              <FitnessSelfCare />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nutrition-self-care"
          element={
            <ProtectedRoute>
              <NutritionSelfCare />
            </ProtectedRoute>
          }
        />
        <Route
          path="/yoga-self-care"
          element={
            <ProtectedRoute>
              <YogaSelfCare />
            </ProtectedRoute>
          }
        />
        <Route
          path="/substance-use-self-care"
          element={
            <ProtectedRoute>
              <SubstanceUseSelfCare />
            </ProtectedRoute>
          }
        />
        <Route
          path="/deaddiction"
          element={
            <ProtectedRoute>
              <DeaddictionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/financial-wellness-self-care"
          element={
            <ProtectedRoute>
              <FinancialWellnessSelfCare />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <CategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subcategory/:subcategoryId"
          element={
            <ProtectedRoute>
              <SubcategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/time/:timeId"
          element={
            <ProtectedRoute>
              <TimePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meditation-detail/:meditationId"
          element={
            <ProtectedRoute>
              <MeditationDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/life-is-kind-detail"
          element={
            <ProtectedRoute>
              <LifeIsKindDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/browse-by-goal-detail/:goalId"
          element={
            <ProtectedRoute>
              <BrowseByGoalDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/see-all/:section"
          element={
            <ProtectedRoute>
              <SeeAllPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collection-detail/:collectionId"
          element={
            <ProtectedRoute>
              <CollectionDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/daily-program/:programId"
          element={
            <ProtectedRoute>
              <DailyProgramPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:providerId"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/health-checks-packages"
          element={
            <ProtectedRoute>
              <HealthChecksPackages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diagnostic-tests"
          element={
            <ProtectedRoute>
              <DiagnosticTests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medicines-pharmacy"
          element={
            <ProtectedRoute>
              <MedicinesPharmacy />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prescription-refill"
          element={
            <ProtectedRoute>
              <PrescriptionRefill />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medical-records"
          element={
            <ProtectedRoute>
              <MedicalRecords />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const userString = localStorage.getItem("mantraUser");
  
  if (!userString) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default App;
