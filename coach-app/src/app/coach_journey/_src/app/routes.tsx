import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { MyFocusAreas } from "./components/MyFocusAreas";
import { MyGoals } from "./components/MyGoals";
import { MyAssessments } from "./components/MyAssessments";
import { AssessmentTest } from "./components/AssessmentTest";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Root,
      children: [
        { index: true, Component: MyFocusAreas },
        { path: "assessments", Component: MyAssessments },
        { path: "assessments/:assessmentId", Component: AssessmentTest },
        { path: "goals", Component: MyGoals },
      ],
    },
  ],
  { basename: "/coach/coach_journey" }
);
