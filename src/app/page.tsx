import { MainStudyHub } from "@/components/MainStudyHub";
import { ThemeController } from "@/components/ThemeController";
import { getDashboardData } from "./actions";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sort?: string; archived?: string }>;
}) {
  const params = await searchParams;
  const data = await getDashboardData(params);

  return (
    <>
      <ThemeController
        defaultTheme={data.settings?.theme === "light" ? "light" : "dark"}
        defaultAccent={data.settings?.accentColor || "#FFD700"}
      />
      <MainStudyHub
        subjects={data.subjects}
        chapters={data.chapters}
        tuitionClasses={data.tuitionClasses}
        homeworkItems={data.homeworkItems}
        studySessions={data.studySessions}
        revisionLogs={data.revisionLogs}
        mockExams={data.mockExams}
        notes={data.notes}
        pdfResources={data.pdfResources}
        todoItems={data.todoItems}
        settings={data.settings}
        metrics={data.metrics}
      />
    </>
  );
}
