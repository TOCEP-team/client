export const defaultCourseState = () => ({
  course_id: '',
  content: '',
  created_at: 0,
  description: '',
  instructor_id: '',
  media: '/images/logo.jpg',
  price: 0,
  rating: 0,
  rating_count: 0,
  students_completed: {},
  students_studying_map: {},
  title: null
});

export const defaultUserState = () => ({
  user_id: '',
  metadata: {
    user_id: '',
    nickname: '',
    role: '',
    total_credit: 0,
    students: 0,
    first_name: '',
    last_name: '',
    bio: null,
    avatar: null,
    resume: '',
    created_at: null,
    updated_at: null,
    courses_owned: null,
  },
  skill: {},
  certificate: [],
  courses: [],
});
