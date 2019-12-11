import axios from './axios'
import { RankingQuery } from '@/types/ranking'
import user from './modules/user'

export default {
  user,
  // 获取分类
  getProblems: (data: {}) => axios.get('/api/v1/problems', { params: data }),
  getProblemsDetail: (data: { id: string }) =>
    axios.get(`/api/v1/problems/${data.id}`),
  getContestProblemsDetail: (data: { cid: string; pid: string }) =>
    axios.get(`/api/v1/contests/${data.cid}/problems/${data.pid}`),
  deleteProblem: (data: { id: string }) =>
    axios.delete(`/api/v1/problems/${data.id}`),
  createProblem: (data: {}) => axios.post('/api/v1/problems', data),
  updateProblem: (data: { id: string; problem: any }) =>
    axios.put(`/api/v1/problems/${data.id}`, data.problem),
  getTags: () => axios.get('/api/v1/tags'),
  // 状态
  getStatus: (data: {}) => axios.get('/api/v1/submissions', { params: data }),
  // 比赛
  getAllTags: (data: {}) => axios.get('/api/v1/tags', { params: data }),
  getContests: (data: {}) => axios.get('/api/v1/contests', { params: data }),
  getContestDetail: (data: { id: string }) =>
    axios.get(`/api/v1/contests/${data.id}`),
  createContest: (data: {
    contestType: string
    description: string
    startDate: any
    endDate: any
    frozenOffset: number
    name: string
    openType: string
    password: string
    sharable: boolean
    visible: boolean
  }) => axios.post('/api/v1/contests', data),
  updateContest: (data: {
    contestId: any
    contest: {
      authorId: any
      name: any
      description: any
      contestType: any
      judgeType: any
      enable: any
      visible: any
      startDate: any
      endDate: any
      password: any
    }
  }) => axios.put(`/api/v1/contests/${data.contestId}`, data.contest),
  deleteContest: (data: { id: string }) =>
    axios.delete(`/api/v1/contests/${data.id}`),
  deleteProblemsInContest: (data: { id: string; problemArray: number[] }) =>
    axios.delete(`/api/v1/contests/${data.id}/problems`, {
      data: data.problemArray,
    }),
  getAllProblemsFromASpecificContest: (data: { id: string }) =>
    axios.get(`/api/v1/contests/${data.id}/problems`),
  setProblemsToContest: (data: { id: string; problemId: Array<string> }) =>
    axios.post(`/api/v1/contests/${data.id}/problems`, data.problemId),
  setProblemScore: (data: { id: string; problemId: string; score: number }) =>
    axios.post(
      `/api/v1/contests/${data.id}/problems/add?problemId=${data.problemId}&&score=${data.score}`
    ),
  getProblemsIdByTitle: (data: {}) =>
    axios.get('/api/v1/problems', { params: data }),
  getRanking: (id: string, params?: RankingQuery) =>
    axios.get(`/api/v1/contests/${id}/ranking`, { params }),
  exportRanking: (id: string, params?: RankingQuery) =>
    axios.get(`/api/v1/contests/${id}/ranking/export`, { params }),
  addGroupsToContest: (data: { id: string; groupId: number[] }) =>
    axios.post(`/api/v1/contests/${data.id}/groups`, data.groupId),
  getAllUserFromContest: (data: { id: string }) =>
    axios.get(`/api/v1/contests/${data.id}/users`),
  deleteUserFromContest: (data: { id: string; userId: number[] }) =>
    axios.delete(`/api/v1/contests/${data.id}/users`, { data: data.userId }),
  addUserToContest: (data: { id: string; userId: number[] }) =>
    axios.post(`/api/v1/contests/${data.id}/users`, data.userId),
  setVisibleContest: (data: { id: string; visible: boolean }) =>
    axios.patch(`/api/v1/contests/${data.id}?visible=${data.visible}`),
  setStatusContest: (data: { id: string; option: any }) =>
    axios.patch(`/api/v1/contests/${data.id}/status?option=${data.option}`),
  sendPassword: (data: { id: string; password: any }) =>
    axios.post(`/api/v1/contests/${data.id}/join?password=${data.password}`),
  contestCommit: (data: {
    contestId: string
    problemId: string
    code: string
    language: string
  }) =>
    axios.post(
      `/api/v1/contests/${data.contestId}/problems/${data.problemId}/submissions`,
      {
        code: data.code,
        language: data.language,
      }
    ),
  getContestSubmission: (data: { contestId: string; problemId: string }) =>
    axios.get(
      `/api/v1/contests/${data.contestId}/problems/${data.problemId}/submissions`
    ),
  getAllSubmissionOfContest: (data: {
    contestId: string
    page: number
    size: number
  }) =>
    axios.get(`/api/v1/contests/${data.contestId}/submissions`, {
      params: { page: data.page, size: data.size },
    }),
  // 公告
  getAllAnnouncements: (data: {}) =>
    axios.get('/api/v1/announcements', { params: data }),
  getAnnouncement: (data: { id: string }) =>
    axios.get(`/api/v1/announcements/${data.id}`),
  createAnnouncement: (data: { title: string; content: string }) =>
    axios.post('/api/v1/announcements', data),
  updateAnnouncement: (data: { title: string; content: string; id: string }) =>
    axios.put(`/api/v1/announcements/${data.id}`, {
      title: data.title,
      content: data.content,
    }),
  removeAnnouncement: (data: { id: string }) =>
    axios.delete(`/api/v1/announcements/${data.id}`),
  // 排名
  getRank: (data: {}) => axios.get('/api/v1/users/ranking', { params: data }),
  // 问题
  getOwnQuestion: (data: { username: string }) =>
    axios.get(`/api/v1/questions/random?username=${data.username}`),
  checkAnswer: (data: { username: string; id: any; answer: any }) =>
    axios.post(`/api/v1/questions/checkAnswer?username=${data.username}`, {
      id: data.id,
      answer: data.answer,
    }),
  forgetPassword: (data: { password: string }) =>
    axios.post(`/api/v1/forgotPassword?password=${data.password}`),
  // Group
  getGroups: (params: {}) => axios.get('/api/v1/groups', { params }),
  getGroup: (params: { id: string }) =>
    axios.get(`/api/v1/groups/${params.id}`),
  deleteMember: (data: { id: string; memberId: string }) =>
    axios.delete(`/api/v1/groups/${data.id}/members`, {
      data: [data.memberId],
    }),
  createGroup: (data: {}) => axios.post('/api/v1/groups', data),
  modifyGroup: (data: { id: string; name: string }) =>
    axios.put(`/api/v1/groups/${data.id}/`, {
      name: data.name,
    }),
  createMembers: (data: {}) => axios.post('/api/v1/users/generate', data),
  deleteGroup: (data: { id: string }) =>
    axios.delete(`/api/v1/groups/${data.id}`),
  getUser: (params: {}) => axios.get('/api/v1/users', { params }),
  deleteUser: (data: {}) => axios.delete('/api/v1/users', data),
  addUserToGroup: (data: { id: string; userId: string }) =>
    axios.post(`/api/v1/groups/${data.id}/members`, [data.userId]),
  createCommit: (data: { id: string; code: string; language: string }) =>
    axios.post(`/api/v1/problems/${data.id}/submissions`, {
      code: data.code,
      language: data.language,
    }),
  getSpecificCommit: (data: { id: string }) =>
    axios.get(`/api/v1/problems/${data.id}/submissions`),
  getCommit: (data: { id: string }) =>
    axios.get(`/api/v1/submissions/${data.id}`),
  getAllQuestions: () => axios.get('/api/v1/questions'),
  setAnswers: (data: {}) => axios.post('/api/v1/questions', data),
  deleteAnswers: (data: {}) => axios.delete('/api/v1/questions'),
  getLogs: (data: { name: string; page: number; size: number }) =>
    axios.get(`/api/v1/logs/auth?name=${data.name}`, {
      params: { page: data.page, size: data.size },
    }),
  getJudgeServer: (data: {}) => axios.get('/api/v1/judge-server/status'),
  getRecommend: (data: {}) => axios.post('/api/v1/problems/recommend', data),
  rejudge: (data: { id: string }) =>
    axios.put(`/api/v1/submissions/${data.id}`),
  resetJudge: (data: { id: string; result: string }) =>
    axios.put(`/api/v1/submissions/${data.id}?result=${data.result}`),
}
