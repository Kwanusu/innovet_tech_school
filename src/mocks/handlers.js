import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock the Course Detail API
  http.get('*/api/courses/:id/', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      title: "DevSecOps Mastery",
      topics: [
        {
          id: 1,
          title: "CI/CD Foundations",
          lessons: [{ id: 101, title: "Intro to GitOps", content: "Markdown content" }]
        }
      ]
    });
  }),

  // Mock the Progress Update API
  http.post('*/api/lessons/:id/complete/', () => {
    return new HttpResponse(null, { status: 200 });
  }),
];