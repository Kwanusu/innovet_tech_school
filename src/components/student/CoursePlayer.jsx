import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseById } from "../../school/schoolSlice";

import CurriculumSidebar from "./CurriculumSidebar";
import LessonPlayer from "./LessonPlayer";

const CoursePlayer = () => {
  const { courseId, lessonId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook for URL navigation

  const { currentCourse, status, completedLessons = [] } =
    useSelector((state) => state.school);

  // Fetch course data on mount
  useEffect(() => {
    dispatch(fetchCourseById(courseId));
  }, [dispatch, courseId]);

  /* Flatten lessons into a single array for navigation logic */
  const lessons = useMemo(() => {
    return currentCourse?.topics?.flatMap(t => t.lessons) || [];
  }, [currentCourse]);

  /* DERIVED STATE: Calculate activeLesson directly from the URL.
     This removes the need for extra useState/useEffect calls.
  */
  const activeLesson = useMemo(() => {
    if (!lessons.length) return null;
    
    if (lessonId) {
      const found = lessons.find(l => l.id === Number(lessonId));
      if (found) return found;
    }
    
    return lessons[0];
  }, [lessons, lessonId]);

  // Helper function to change lessons by updating the URL
  const handleLessonChange = (id) => {
    navigate(`/courses/${courseId}/lessons/${id}`);
  };

  if (status === "loading" && !currentCourse) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-slate-600 font-medium">Loading Course...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <CurriculumSidebar
        course={currentCourse}
        activeLessonId={activeLesson?.id}
        completedLessons={completedLessons}
        onSelectLesson={handleLessonChange} // Now updates the URL
      />

      <LessonPlayer
        course={currentCourse} // Add this prop
        lesson={activeLesson}
        lessons={lessons}
        completedLessons={completedLessons}
        setActiveLessonId={handleLessonChange} 
        courseId={courseId}
      />
    </div>
  );
};

export default CoursePlayer;