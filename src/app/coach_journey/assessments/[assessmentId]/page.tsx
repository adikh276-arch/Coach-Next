import ClientPage from "./ClientPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { assessmentId: 'emotional-intelligence' },
    { assessmentId: 'strength-assessment' },
    { assessmentId: 'leadership-potential' }
  ];
}

export default function AssessmentTestPage() {
  return <ClientPage />;
}
