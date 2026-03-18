import { CheckCircle2, Circle, ChevronRight } from "lucide-react";

const CurriculumSidebar = ({
  course,
  activeLessonId,
  completedLessons = [],
  onSelectLesson
}) => {
  return (
    <aside className="w-[320px] h-full border-r bg-slate-50/50 overflow-y-auto">
      <div className="p-6 border-b bg-white">
        <h2 className="font-bold text-lg truncate">{course?.title}</h2>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
          Course Curriculum
        </p>
      </div>

      {course?.topics?.map((topic) => (
        <div key={topic.id} className="mb-2">
          <div className="px-6 py-3 bg-slate-100/50 border-y border-slate-200/60">
            <h3 className="font-semibold text-sm text-slate-700 uppercase tracking-tight">
              {topic.title}
            </h3>
          </div>

          <div className="py-1">
            {topic.lessons.map((lesson) => {
              const isCompleted = completedLessons.includes(lesson.id);
              const isActive = lesson.id === activeLessonId;

              return (
                <button
                  key={lesson.id}
                  onClick={() => onSelectLesson(lesson.id)}
                  className={`group flex items-center gap-3 w-full text-left px-6 py-3 transition-all
                    ${isActive ? "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600" : "text-slate-600 hover:bg-slate-100"}
                  `}
                >
                  {/* The Status Icon */}
                  <div className="shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                    ) : (
                      <Circle className={`w-5 h-5 ${isActive ? "text-indigo-400" : "text-slate-300 group-hover:text-slate-400"}`} />
                    )}
                  </div>

                  <span className={`text-sm font-medium leading-tight ${isActive ? "font-bold" : ""}`}>
                    {lesson.title}
                  </span>

                  {/* Optional: Right Chevron for Active Lesson */}
                  {isActive && (
                    <ChevronRight className="ml-auto w-4 h-4 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
};

export default CurriculumSidebar;