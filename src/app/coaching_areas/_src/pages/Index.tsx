import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { coachingAreas, type CoachingArea, type Exercise } from "@/data/coachingAreas";
import { exerciseTemplates, exerciseTitleToTemplateId, specialExercises } from "@/data/exerciseTemplates";
import { selfCareQuiz, selfCareCheckin } from "@/data/wellnessExercises";
import { learnContent } from "@/data/learnContent";
import { resourcesContent } from "@/data/resourcesContent";
import CoachingAreaCard from "@/components/CoachingAreaCard";
import CoachingAreaDetail from "@/components/CoachingAreaDetail";
import ExerciseDetail from "@/components/ExerciseDetail";
import LearnDetail from "@/components/LearnDetail";
import ResourceDetail from "@/components/ResourceDetail";
import SelfCareQuizExercise from "@/components/SelfCareQuizExercise";
import SelfCareCheckinExercise from "@/components/SelfCareCheckinExercise";
import WeeklySuccessPlannerExercise from "@/components/WeeklySuccessPlannerExercise";
import StopProcrastinatingExercise from "@/components/StopProcrastinatingExercise";
import GetMotivatedExercise from "@/components/GetMotivatedExercise";
import IntuitionExercise from "@/components/IntuitionExercise";
import LoveAndLoatheExercise from "@/components/LoveAndLoatheExercise";
import DiscoverYourselfExercise from "@/components/DiscoverYourselfExercise";
import GratitudeDiaryExercise from "@/components/GratitudeDiaryExercise";
import WackyWildGoalExercise from "@/components/WackyWildGoalExercise";
import BigRocksExercise from "@/components/BigRocksExercise";
import RockingChairExercise from "@/components/RockingChairExercise";
import SmartGoalsExercise from "@/components/SmartGoalsExercise";
import { useTranslation } from "react-i18next";
import { useRouter, useParams } from "next/navigation";

const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '_').replace(/[^\w-]+/g, '');

const Index = () => {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const router = useRouter();

  const slug = (params.slug as string[]) || [];
  
  // Parse Next.js slug array into old variables
  let areaId: string | undefined;
  let exerciseSlug: string | undefined;
  let learnIndex: string | undefined;
  let resourceType: string | undefined;

  if (slug.length >= 1) areaId = slug[0];
  if (slug.length === 2 && slug[1] !== "learn" && slug[1] !== "resource") exerciseSlug = slug[1];
  if (slug.length === 3 && slug[1] === "learn") learnIndex = slug[2];
  if (slug.length === 3 && slug[1] === "resource") resourceType = slug[2];

  // Derive selected states from URL
  const selectedArea = areaId ? coachingAreas.find(a => a.id === areaId) || null : null;
  
  const selectedExercise = (selectedArea && exerciseSlug) 
    ? selectedArea.exercises.find(e => slugify(e.title) === exerciseSlug) || null
    : null;

  const selectedLearn = (areaId && learnIndex) ? { areaId, index: parseInt(learnIndex) } : null;
  const selectedResource = (areaId && resourceType) ? { areaId, type: resourceType as any } : null;

  const handleAreaClick = (area: CoachingArea) => {
    router.replace(`/coaching_areas/${area.id}`);
  };

  const handleExerciseClick = (exercise: Exercise) => {
    if (selectedArea) {
      router.replace(`/coaching_areas/${selectedArea.id}/${slugify(exercise.title)}`);
    }
  };

  const handleLearnClick = (areaId: string, lIdx: number) => {
    router.replace(`/coaching_areas/${areaId}/learn/${lIdx}`);
  };

  const handleResourceClick = (areaId: string, rType: "tips" | "quotes" | "ebooks") => {
    router.replace(`/coaching_areas/${areaId}/resource/${rType}`);
  };

  const handleBack = () => {
    if (exerciseSlug || learnIndex || resourceType) {
      router.replace(`/coaching_areas/${areaId}`);
    } else if (areaId) {
      router.replace("/coaching_areas/");
    } else {
      router.replace("/coaching_areas/");
    }
  };

  const specialType = selectedExercise ? specialExercises[selectedExercise.title] : null;

  const activeTemplate = selectedExercise && !specialType
    ? exerciseTemplates[exerciseTitleToTemplateId[selectedExercise.title]]
    : null;

  const activeLearnArticle = selectedLearn
    ? learnContent[selectedLearn.areaId]?.[selectedLearn.index]
    : null;

  const activeResources = selectedResource
    ? resourcesContent[selectedResource.areaId]
    : null;

  // Verification: If the translation key hasn't loaded, show a fallback
  const coachingAreasTitle = i18n.exists("common.coachingAreas") ? t("common.coachingAreas") : "Coaching Areas";
  const whatInterestsYouSub = i18n.exists("common.whatInterestsYou") ? t("common.whatInterestsYou") : "What coaching focus interests you?";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-6 sm:max-w-2xl">
        <AnimatePresence mode="wait">
          {selectedExercise && specialType === "quiz" ? (
            <SelfCareQuizExercise
              key="self-care-quiz"
              template={selfCareQuiz}
              onBack={handleBack}
            />
          ) : selectedExercise && specialType === "checkin" ? (
            <SelfCareCheckinExercise
              key="self-care-checkin"
              template={selfCareCheckin}
              onBack={handleBack}
            />
          ) : selectedExercise && specialType === "planner" ? (
            <WeeklySuccessPlannerExercise
              key="weekly-planner"
              onBack={handleBack}
            />
          ) : selectedExercise && specialType === "procrastinating" ? (
            <StopProcrastinatingExercise
              key="stop-procrastinating"
              onBack={handleBack}
            />
          ) : selectedExercise && specialType === "get-motivated" ? (
            <GetMotivatedExercise
              key="get-motivated"
              onBack={handleBack}
            />
          ) : selectedExercise && specialType === "intuition" ? (
            <IntuitionExercise
              key="intuition"
              onBack={handleBack}
            />
          ) : selectedExercise && specialType === "love-loathe" ? (
            <LoveAndLoatheExercise
              key="love-loathe"
              onBack={handleBack}
            />
          ) : selectedExercise && specialType === "discover-yourself" ? (
            <DiscoverYourselfExercise
              key="discover-yourself"
              onBack={handleBack}
            />
          ) : selectedExercise && specialType === "gratitude-diary" ? (
            <GratitudeDiaryExercise
              key="gratitude-diary"
              onBack={handleBack}
            />
          ) : selectedExercise && specialType === "wacky-wild-goal" ? (
            <WackyWildGoalExercise
              key="wacky-wild-goal"
              onBack={handleBack}
            />
          ) : selectedExercise && specialType === "big-rocks" ? (
            <BigRocksExercise
              key="big-rocks"
              onBack={handleBack}
            />
          ) : selectedExercise && specialType === "rocking-chair" ? (
            <RockingChairExercise
              key="rocking-chair"
              onBack={handleBack}
            />
          ) : selectedExercise && specialType === "smart-goals" ? (
            <SmartGoalsExercise
              key="smart-goals"
              onBack={handleBack}
            />
          ) : activeTemplate && selectedExercise ? (
            <ExerciseDetail
              key={activeTemplate.id}
              template={activeTemplate}
              onBack={handleBack}
              coachingAreaId={selectedArea?.id}
              exerciseId={activeTemplate.id}
            />
          ) : activeLearnArticle && selectedLearn ? (
            <LearnDetail
              key={activeLearnArticle.id}
              article={activeLearnArticle}
              areaId={selectedLearn.areaId}
              index={selectedLearn.index}
              onBack={handleBack}
            />
          ) : activeResources && selectedResource ? (
            <ResourceDetail
              key={`${selectedResource.areaId}-${selectedResource.type}`}
              areaId={selectedResource.areaId}
              resourceType={selectedResource.type}
              resources={activeResources}
              onBack={handleBack}
            />
          ) : selectedArea ? (
            <CoachingAreaDetail
              key={selectedArea.id}
              area={selectedArea}
              onBack={handleBack}
              onExerciseClick={handleExerciseClick}
              onLearnClick={handleLearnClick}
              onResourceClick={handleResourceClick}
            />
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <div className="relative flex items-center justify-center mb-8 px-2" dir="ltr">
                <h1 className="text-2xl font-bold text-slate-900">{coachingAreasTitle}</h1>
              </div>
              
              <p className="mb-8 text-center text-sm font-medium text-slate-500">
                {whatInterestsYouSub}
              </p>
              <div className="grid grid-cols-4 gap-4">
                {coachingAreas.map((area, i) => (
                  <CoachingAreaCard
                    key={area.id}
                    area={area}
                    index={i}
                    onClick={() => handleAreaClick(area)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
