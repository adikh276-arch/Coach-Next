import ClientPage from "./ClientPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { slug: [] },
    { slug: ["assessments"] },
    { slug: ["goals"] },
    { slug: ["assessments", "emotional-intelligence"] },
    { slug: ["assessments", "strength-assessment"] },
    { slug: ["assessments", "leadership-potential"] },
  ];
}

export default function Page() {
  return <ClientPage />;
}
