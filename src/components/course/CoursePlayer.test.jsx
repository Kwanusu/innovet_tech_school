import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setupStore } from '../../app/store'; // Your Redux store config
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CoursePlayer from './CoursePlayer';
import { beforeAll, afterEach, afterAll, expect, describe, it } from 'vitest';
import { server } from '../../mocks/server';

// MSW Lifecycle
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

    // 1. Check if course title loads from MSW
    expect(await screen.findByText('DevSecOps Mastery')).toBeInTheDocument();

    // 2. Verify Sidebar shows the lesson
    const lessonItem = screen.getByText('Intro to GitOps');
    expect(lessonItem).toBeInTheDocument();

    // 3. Click "Mark as Complete" in the Navigation Footer
    const completeBtn = screen.getByRole('button', { name: /mark as complete/i });
    fireEvent.click(completeBtn);

    // 4. Verify UI reflects completion (The Emerald Checkmark we built)
    await waitFor(() => {
      const checkmark = screen.getByTestId('completed-icon'); // Add data-testid to your Icon
      expect(checkmark).toBeInTheDocument();
    });

    // 5. Verify Toast Notification (Sonner)
    expect(await screen.findByText('Progress updated')).toBeInTheDocument();
  });
});