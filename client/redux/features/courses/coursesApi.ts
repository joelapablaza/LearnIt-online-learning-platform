import { apiSlice } from "../api/apiSlice";

export const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (data) => ({
        url: "/create-course",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
    getAllCourses: builder.query({
      query: () => ({
        url: "/get-courses",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getCourseDetails: builder.query({
      query: (id) => ({
        url: `/get-course/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getAdminAllCourses: builder.query({
      query: () => ({
        url: "/get-admin-courses",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    updateCourse: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `edit-course/${id}`,
          method: "PUT",
          body: data,
          credentials: "include" as const,
        };
      },
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/delete-course/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
    getCourseContent: builder.query({
      query: (id) => ({
        url: `/get-course-content/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    addNewQuestion: builder.mutation({
      query: ({ question, courseId, contentId }) => ({
        url: `/add-question/`,
        method: "PUT",
        body: { question, courseId, contentId },
        credentials: "include" as const,
      }),
    }),
    addAnswerInQuestion: builder.mutation({
      query: ({ answer, courseId, contentId, questionId }) => ({
        url: `/add-answer/`,
        method: "PUT",
        body: { answer, courseId, contentId, questionId },
        credentials: "include" as const,
      }),
    }),
    addReviewInCorse: builder.mutation({
      query: ({ review, rating, courseId, avatar }) => ({
        url: `/add-review/${courseId}`,
        method: "PUT",
        body: { review, rating, avatar },
        credentials: "include" as const,
      }),
    }),
    addReplyInReview: builder.mutation({
      query: ({ reviewReply, courseId, reviewId }) => ({
        url: `/add-reply`,
        method: "PUT",
        body: { reviewReply, courseId, reviewId },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useDeleteCourseMutation,
  useUpdateCourseMutation,
  useGetAdminAllCoursesQuery,
  useGetCourseDetailsQuery,
  useGetCourseContentQuery,
  useAddNewQuestionMutation,
  useAddAnswerInQuestionMutation,
  useAddReviewInCorseMutation,
  useAddReplyInReviewMutation,
} = courseApi;
