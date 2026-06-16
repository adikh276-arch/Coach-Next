import { useTranslation } from "react-i18next";

/**
 * Hook to handle translation of dynamic data objects.
 * Looks up the translated value in i18n resources, falls back to original if missing.
 */
export const useTranslatedContent = () => {
  const { t, i18n } = useTranslation();

  const getTranslatedArea = (area: any) => ({
    ...area,
    name: t(`coaching.${area.id}.name`, { defaultValue: area.name })
  });

  const getTranslatedLearn = (areaId: string, index: number, original: any) => ({
    ...original,
    title: t(`learn.${areaId}.${index}.title`, { defaultValue: original.title }),
    paragraphs: t(`learn.${areaId}.${index}.content`, { defaultValue: original.paragraphs, returnObjects: true })
  });

  const getTranslatedResource = (areaId: string, original: any) => {
    return {
      tips: t(`resources.${areaId}.tips`, { defaultValue: original.tips, returnObjects: true }),
      quotes: t(`resources.${areaId}.quotes`, { defaultValue: original.quotes, returnObjects: true }),
      ebooks: t(`resources.${areaId}.ebooks`, { defaultValue: original.ebooks, returnObjects: true }),
    };
  };

  const getTranslatedExercise = (templateId: string, original: any) => {
    return {
      ...original,
      title: t(`exercises.${templateId}.title`, { defaultValue: original.title }),
      description: t(`exercises.${templateId}.description`, { defaultValue: original.description }),
      importantNote: original.importantNote ? t(`exercises.${templateId}.importantNote`, { defaultValue: original.importantNote }) : undefined,
      footerNote: original.footerNote ? t(`exercises.${templateId}.footerNote`, { defaultValue: original.footerNote }) : undefined,
      fields: original.fields.map((field: any, idx: number) => ({
        ...field,
        label: t(`exercises.${templateId}.fields.${idx}.label`, { defaultValue: field.label }),
        subtitle: field.subtitle ? t(`exercises.${templateId}.fields.${idx}.subtitle`, { defaultValue: field.subtitle }) : undefined,
        prompts: Array.isArray(field.prompts) 
          ? t(`exercises.${templateId}.fields.${idx}.prompts`, { defaultValue: field.prompts, returnObjects: true }) 
          : [],
        columns: Array.isArray(field.columns) 
          ? t(`exercises.${templateId}.fields.${idx}.columns`, { defaultValue: field.columns, returnObjects: true }) 
          : [],
        items: Array.isArray(field.items) 
          ? t(`exercises.${templateId}.fields.${idx}.items`, { defaultValue: field.items, returnObjects: true }) 
          : [],
      }))
    };
  };

  const getTranslatedQuiz = (template: any) => {
    return {
      ...template,
      title: t(`exercises.${template.id}.title`, { defaultValue: template.title }),
      description: t(`exercises.${template.id}.description`, { defaultValue: template.description }),
      questions: template.questions.map((q: any, i: number) => ({
        ...q,
        text: t(`exercises.${template.id}.questions.${i}.text`, { defaultValue: q.text }),
        options: Array.isArray(t(`exercises.${template.id}.questions.${i}.options`, { defaultValue: q.options, returnObjects: true }))
          ? t(`exercises.${template.id}.questions.${i}.options`, { defaultValue: q.options, returnObjects: true })
          : q.options
      }))
    };
  };

  const getTranslatedCheckin = (template: any) => {
    return {
      ...template,
      title: t(`exercises.${template.id}.title`, { defaultValue: template.title }),
      description: t(`exercises.${template.id}.description`, { defaultValue: template.description }),
      categories: template.categories.map((cat: any, i: number) => ({
        ...cat,
        label: t(`exercises.${template.id}.categories.${i}.label`, { defaultValue: cat.label })
      }))
    };
  };

  return {
    getTranslatedArea,
    getTranslatedLearn,
    getTranslatedResource,
    getTranslatedExercise,
    getTranslatedQuiz,
    getTranslatedCheckin,
    lang: i18n.language
  };
};
