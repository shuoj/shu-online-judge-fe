import axios from 'axios';
import router from '@/router';

axios.defaults.baseURL =
  process.env.VUE_APP_BASE_URL;
axios.interceptors.request.use(
  function(config) {
    console.log({ env: process.env });
    if (window.localStorage.getItem('token')) {
      config.headers['Authorization'] =
        'Bearer ' + window.localStorage.getItem('token');
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          if (!window.localStorage.getItem('times')) {
            window.localStorage.setItem('times', 'done');
            window.localStorage.setItem('token', '');
            window.localStorage.setItem('username', '');
            window.localStorage.setItem('role', '');
            const lastRoute = router.currentRoute.fullPath;
            router.replace({
              path: 'login',
              query: { redirect: lastRoute } // 将跳转的路由path作为参数，登录成功后跳转到该路由
            });
          }
      }
    }
    return Promise.reject(error.response);
  }
);

export default {
  // 获取分类
  getProblems: (data: {}) => axios.get('/api/v1/problems', { params: data }),
  getProblemsDetail: (data: { id: string }) => axios.get(`/api/v1/problems/${data.id}`),
  deleteProblem: (data: {id: string}) => axios.delete(`/api/v1/problems/${data.id}`),
  createProblem: (data: {}) => axios.post('/api/v1/problems', data),
  updateProblem: (data: {id: string, problem: any}) => axios.put(`/api/v1/problems/${data.id}`, data.problem),
  getTags: () => axios.get('/api/v1/tags'),
  // 状态
  getStatus: (data: {}) => axios.get('/api/v1/submissions', { params: data }),
  // 比赛
  getAllTags: (data: {}) => axios.get('/api/v1/tags', { params: data }),
  getContests: (data: {}) => axios.get('/api/v1/contests', { params: data }),
  getContestDetail: (data: { id: string }) => axios.get(`/api/v1/contests/${data.id}`),
  createContest: (data: {
    authorId: any,
    name: any,
    description: any,
    contestType: any,
    judgeType: any,
    enable: any,
    visible: any,
    startDate: any,
    endDate: any,
    password: any
  }) => axios.post('/api/v1/contests', data),
  updateContest: (data: {
    contestId: any,
    contest: {
      authorId: any,
      name: any,
      description: any,
      contestType: any,
      judgeType: any,
      enable: any,
      visible: any,
      startDate: any,
      endDate: any,
      password: any
    }
  }) => axios.put(`/api/v1/contests/${data.contestId}`, data.contest),
  deleteContest: (data: { id: string }) => axios.delete(`/api/v1/contests/${data.id}`),
  deleteProblemsInContest: (data: { id: string, problemArray: number[] }) => axios.delete(`/api/v1/contests/${data.id}/problems`, { data: data.problemArray }),
  getAllProblemsFromASpecificContest: (data: { id: string }) => axios.get(`/api/v1/contests/${data.id}/problems`),
  setProblemsToContest: (data: { id: string, problemId: Array<string> }) => axios.post(`/api/v1/contests/${data.id}/problems`, data.problemId),
  getProblemsIdByTitle: (data: { title: string }) => axios.get('/api/v1/problems', { params: data }),
  getRanking: (data: { id: string }) => axios.get(`/api/v1/contests/${data.id}/ranking`, { params: data }),
  addGroupsToContest: (data: { id: string, groupId: number[] }) => axios.post(`/api/v1/contests/${data.id}/groups`, data.groupId),
  getAllUserFromContest: (data: { id: string }) => axios.get(`/api/v1/contests/${data.id}/users`),
  deleteUserFromContest: (data: { id: string, userId: number[] }) => axios.delete(`/api/v1/contests/${data.id}/users`, { data: data.userId }),
  addUserToContest: (data: { id: string, userId: number[] }) => axios.post(`/api/v1/contests/${data.id}/users`, data.userId),
  setVisibleContest: (data: { id: string, visible: boolean }) => axios.patch(`/api/v1/contests/${data.id}?visible=${data.visible}`),
  setStatusContest: (data: { id: string, option: any }) => axios.patch(`/api/v1/contests/${data.id}/status?option=${data.option}`),
  sendPassword: (data: { id: string, password: any }) => axios.post(`/api/v1/contests/${data.id}/join?password=${data.password}`),
  contestCommit: (data: { contestId: string, problemId: string, code: string, language: string }) => axios.post(`/api/v1/contests/${data.contestId}/problems/${data.problemId}/submissions`, {
    code: data.code,
    language: data.language
  }),
  getContestSubmission: (data: { contestId: string, problemId: string }) => axios.get(`/api/v1/contests/${data.contestId}/problems/${data.problemId}/submissions`),
  // 公告
  getAllAnnouncements: (data: {}) => axios.get('/api/v1/announcements', { params: data }),
  getAnnouncement: (data: { id: string }) => axios.get(`/api/v1/announcements/${data.id}`),
  createAnnouncement: (data: { title: string, content: string }) => axios.post('/api/v1/announcements', data),
  updateAnnouncement: (data: { title: string, content: string, id: string }) => axios.put(`/api/v1/announcements/${data.id}`, {
    title: data.title,
    content: data.content
  }),
  removeAnnouncement: (data: { id: string }) => axios.delete(`/api/v1/announcements/${data.id}`),
  // 排名
  getRank: (data: {}) => axios.get('/api/v1/users/ranking', { params: data }),
  // 注册、登陆、刷新token
  register: (data: {}) => axios.post('/api/v1/register', data),
  login: (data: {}) => axios.post('/api/v1/auth', data),
  refresh: (data: {}) => axios.post('/api/v1/refresh', data),
  getUserInfo: () => axios.get('/api/v1/me'),
  getOtherUserInfo: (data: { id: string }) => axios.get(`/api/v1/users/${data.id}`),
  getOwnQuestion: (data: { username: string }) => axios.get(`/api/v1/questions/random?username=${data.username}`),
  checkAnswer: (data: { username: string, id: any, answer: any }) => axios.post(`/api/v1/questions/checkAnswer?username=${data.username}`, { id: data.id, answer: data.answer }),
  forgetPassword: (data: { password: string }) => axios.post(`/api/v1/forgotPassword?password=${data.password}`),
  // Group
  getGroups: () => axios.get('/api/v1/groups'),
  deleteMember: (data: { id: string, memberId: string }) => axios.delete(`/api/v1/groups/${data.id}/members`, {
    data: [data.memberId]
  }),
  createGroup: (data: {}) => axios.post('/api/v1/groups', data),
  modifyGroup: (data: { id: string, name: string }) => axios.put(`/api/v1/groups/${data.id}/`, {
    name: data.name
  }),
  deleteGroup: (data: { id: string }) => axios.delete(`/api/v1/groups/${data.id}`),
  getUser: (data: { username: string, page: number, size: number }) => axios.get('/api/v1/users', { params: data }),
  addUserToGroup: (data: { id: string, userId: string }) => axios.post(`/api/v1/groups/${data.id}/members`,
    [data.userId]),
  getSpecificGroup: (data: { id: string }) => axios.get(`/api/v1/groups/${data.id}`),
  createCommit: (data: { id: string, code: string, language: string }) => axios.post(`/api/v1/problems/${data.id}/submissions`, {
    code: data.code,
    language: data.language
  }),
  getSpecificCommit: (data: { id: string }) => axios.get(`/api/v1/problems/${data.id}/submissions`),
  getCommit: (data: { id: string }) => axios.get(`/api/v1/submissions/${data.id}`),
  getAllQuestions: () => axios.get('/api/v1/questions'),
  setAnswers: (data: {}) => axios.post('/api/v1/questions', data),
  deleteAnswers: (data: {}) => axios.delete('/api/v1/questions'),
  getLogs: (data: { name: string, page: number, size: number }) => axios.get(`/api/v1/logs/auth?name=${data.name}`, { params: { page: data.page, size: data.size } }),
  getJudgeServer: (data: {}) => axios.get('/api/v1/judge-server/status'),
  getRecommend: (data: {}) => axios.post('/api/v1/problems/recommend', data)
};
