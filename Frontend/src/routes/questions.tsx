import { createFileRoute } from "@tanstack/react-router";
import { QuestionBoard } from "@/components/QuestionBoard";

export const Route = createFileRoute("/questions")({
  head: () => ({
    meta: [
      { title: "Question board — DSA Tracker" },
      { name: "description", content: "A shared board of useful DSA problems with notes, tags, and upvotes." },
      { property: "og:title", content: "DSA Question Board" },
      { property: "og:description", content: "Save and discuss the problems worth talking about." },
    ],
  }),
  component: QuestionsPage,
});

function QuestionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Question board</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          A collaborative library of problems worth solving. Add notes, tag them, and upvote the gems.
        </p>
      </div>
      <QuestionBoard />
    </div>
  );
}
