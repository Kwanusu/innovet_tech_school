const CurriculumSidebar = ({
  course,
  activeLessonId,
  completedLessons,
  onSelectLesson
}) => {

  return (
    <aside className="w-[320px] border-r bg-white">

      {course?.topics?.map((topic) => (

        <div key={topic.id}>

          <h3 className="font-bold p-4">
            {topic.title}
          </h3>

          {topic.lessons.map((lesson) => (

            <button
              key={lesson.id}
              onClick={() => onSelectLesson(lesson.id)}
              className={`block w-full text-left px-6 py-2
                ${lesson.id === activeLessonId ? "bg-indigo-50" : ""}
              `}
            >

              {completedLessons.includes(lesson.id) && "✓ "}
              {lesson.title}

            </button>

          ))}

        </div>

      ))}

    </aside>
  );
};

export default CurriculumSidebar;