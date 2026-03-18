import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setupStore } from '../../app/store';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CoursePlayer from '../../components/student/CoursePlayer';
import { server } from '../../mocks/server';
import { beforeAll, afterEach, afterAll, expect, describe, it } from 'vitest';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Innovet Tech: Student Learning Workflow', () => {
  it('navigates through lessons and updates progress indicators', async () => {
    const store = setupStore();
    
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/courses/1/lessons/101']}>
          <Routes>
            <Route path="/courses/:courseId/lessons/:lessonId" element={<CoursePlayer />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // 1. Wait for loading to finish and Course Title to appear
    expect(await screen.findByText('DevSecOps Mastery')).toBeInTheDocument();

    // 2. Disambiguate the lesson title (Sidebar vs Header)
    const sidebarButton = screen.getByRole('button', { name: /Intro to GitOps/i });
    expect(sidebarButton).toBeInTheDocument();

    // 3. Find the 'Mark as Complete' button inside LessonPlayer
    // We use findBy because it might take a moment for the 'loading' div to swap out
    const completeBtn = await screen.findByRole('button', { name: /mark as complete/i });
    
    // 4. Trigger completion
    fireEvent.click(completeBtn);

    // 5. Verify the Emerald Checkmark appears in the Sidebar
    // (Assuming your sidebar renders a checkmark when ID is in completedLessons)
      // If you use a Lucide check icon, you might need a test ID or check for a specific class
      await waitFor(() => {
      const completedBadge = screen.getByText(/completed/i);
      expect(completedBadge).toBeInTheDocument();
    }, { timeout: 3000 });
    });
  });