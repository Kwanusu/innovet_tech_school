import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseById } from "../../school/schoolSlice";

import CurriculumSidebar from "./CurriculumSidebar";
import LessonPlayer from "./LessonPlayer";

const CoursePlayer = () => {

  const { courseId } = useParams();
  const dispatch = useDispatch();

  const { currentCourse, status, completedLessons = [] } =
    useSelector((state) => state.school);

  const [activeLessonId, setActiveLessonId] = useState(null);

  useEffect(() => {
    dispatch(fetchCourseById(courseId));
  }, [dispatch, courseId]);

  /*
  Flatten lessons
  */

  const lessons = useMemo(() => {
    return currentCourse?.topics?.flatMap(t => t.lessons) || [];
  }, [currentCourse]);

  /*
  Active lesson
  */

  const activeLesson = useMemo(() => {

    if (!lessons.length) return null;

    return (
      lessons.find(l => l.id === activeLessonId) ||
      lessons[0]
    );

  }, [lessons, activeLessonId]);

  if (status === "loading" && !currentCourse) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">

      <CurriculumSidebar
        course={currentCourse}
        activeLessonId={activeLesson?.id}
        completedLessons={completedLessons}
        onSelectLesson={setActiveLessonId}
      />

      <LessonPlayer
        lesson={activeLesson}
        lessons={lessons}
        completedLessons={completedLessons}
        setActiveLessonId={setActiveLessonId}
        courseId={courseId}
      />

    </div>
  );
};

export default CoursePlayer;