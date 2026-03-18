import React, { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useDispatch } from "react-redux";
import { markLessonComplete } from "../../school/schoolSlice";
import LessonNavigationFooter from "../../pages/LessonNavigationFooter";
import { FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

const LessonPlayer = ({
  course,
  lessons = [],
  lesson,
  completedLessons = [],
  setActiveLessonId,
  courseId,
  loading = false
}) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // We only need the index to find the next lesson for auto-advance
  const index = useMemo(
    () => lessons.findIndex(l => l.id === lesson?.id),
    [lessons, lesson?.id]
  );

  const isCompleted = completedLessons.includes(lesson?.id);

  const handleComplete = async () => {
    if (!lesson) return;
    setIsSubmitting(true);
    
    try {
      if (!isCompleted) {
        await dispatch(markLessonComplete({ courseId, lessonId: lesson.id })).unwrap();
        toast.success("Lesson marked as complete!");
      }
      
      // Auto-advance logic: find the next lesson from our flattened list
      const nextLesson = index < lessons.length - 1 ? lessons[index + 1] : null;
      if (nextLesson) {
        setActiveLessonId(nextLesson.id);
      }
    } catch  {
      toast.error("Failed to update progress. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Syncing Content...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-300 bg-slate-50/30">
        <FileText size={64} strokeWidth={1} className="opacity-20" />
        <p className="mt-4 font-black uppercase tracking-widest text-[10px] text-slate-400">
          Select a lesson to begin
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-white relative">
      <div className="max-w-4xl mx-auto p-8 lg:p-16 space-y-10 pb-40 w-full">
        
        {/* Video Player Section */}
        <div className="relative aspect-video bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group">
          {lesson.video_url ? (
            <iframe
              src={lesson.video_url}
              className="w-full h-full"
              allowFullScreen
              title={lesson.title}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <FileText size={48} className="text-slate-700 opacity-20" />
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                No Video Content Available
              </p>
            </div>
          )}
        </div>

        {/* Lesson Header & Content */}
        <div className="space-y-6">
          <div className="pb-6 border-b border-slate-100">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {lesson.title}
            </h1>
          </div>

          {lesson.content && (
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <article className="prose prose-slate prose-lg max-w-none 
                prose-headings:font-black prose-p:leading-relaxed 
                prose-pre:bg-slate-900 prose-pre:text-indigo-300">
                <ReactMarkdown>{lesson.content}</ReactMarkdown>
              </article>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <LessonNavigationFooter
        course={course}
        currentLessonId={lesson?.id}
        isCompleted={isCompleted}
        onMarkAsComplete={handleComplete}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default LessonPlayer;