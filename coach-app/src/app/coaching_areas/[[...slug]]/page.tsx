import ClientPage from "./ClientPage";
import { coachingAreas } from "../_src/data/coachingAreas";

const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '_').replace(/[^\w-]+/g, '');

export const dynamicParams = false;

export function generateStaticParams() {
  const paths: { slug: string[] }[] = [{ slug: [] }];

  coachingAreas.forEach((area) => {
    // 1. /coaching_areas/:areaId
    paths.push({ slug: [area.id] });

    // 2. /coaching_areas/:areaId/:exerciseSlug
    area.exercises.forEach((ex) => {
      paths.push({ slug: [area.id, slugify(ex.title)] });
    });

    // 3. /coaching_areas/:areaId/learn/:index
    area.learn.forEach((_, index) => {
      paths.push({ slug: [area.id, "learn", index.toString()] });
    });

    // 4. /coaching_areas/:areaId/resource/:type
    area.resources.forEach((res) => {
      paths.push({ slug: [area.id, "resource", res.type] });
    });
  });

  return paths;
}

export default function Page() {
  return <ClientPage />;
}
