import Vue from 'vue';
import Router from 'vue-router';
// TS 默认只识别.vue文件，不识别.vue文件
import problems from '@/views/Problems.vue';
import status from '@/views/Status.vue';
import contests from '@/views/Contests.vue';
import group from '@/views/Group.vue';
import login from '@/views/Login.vue';
import register from '@/views/Register.vue';
import forget from '@/views/Forget.vue';
import help from '@/views/Help.vue';
import about from '@/views/About.vue';
import rank from '@/views/Rank.vue';
import personal from '@/views/Personal.vue';
import submission from '@/views/Submission.vue';
import share from '@/views/Share.vue';
import setting from '@/views/Setting.vue';

// component
import problemDetail from '@/components/ProblemDetail.vue';
import contestDetail from '@/components/ContestDetail.vue';
import announcement from '@/components/Announcement.vue';
import contestProblemCommit from '@/components/ContestProblemCommit.vue';

// admin
import adminIndex from '@/admin/adminIndex.vue';

Vue.use(Router);

// @ts-ignore
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: problems
    },
    {
      path: '/problems',
      name: 'problems',
      component: problems
    },
    {
      path: '/problems/:id',
      name: 'problem',
      component: problemDetail
    },
    {
      path: '/share/:id',
      name: 'share',
      component: share
    },
    {
      path: '/status',
      name: 'status',
      component: status
    },
    {
      path: '/contests',
      name: 'contests',
      component: contests
    },
    {
      path: '/contests/:id',
      name: 'contest',
      component: contestDetail
    },
    {
      path: '/contests/:contestId/problems/:problemId',
      name: 'contest-problem',
      component: contestProblemCommit
    },
    {
      path: '/announcement/:id',
      name: 'announcement',
      component: announcement
    },
    {
      path: '/group',
      name: 'group',
      component: group
    },
    {
      path: '/submission/:id',
      name: 'submission',
      component: submission
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/forget',
      name: 'forget',
      component: forget
    },
    {
      path: '/rank',
      name: 'rank',
      component: rank
    },
    {
      path: '/help',
      name: 'help',
      component: help
    },
    {
      path: '/about',
      name: 'about',
      component: about
    },
    {
      path: '/personal/:id',
      name: 'personal',
      component: personal
    },
    {
      path: '/setting/:id',
      name: 'setting',
      component: setting
    },
    {
      path: '/admin',
      name: 'adminIndex',
      component: adminIndex,
      redirect: '/admin/index',
      meta: {
        requireAuthAdmin: true
      },
      children: [
        {
          path: 'judge-server',
          name: 'judge-server',
          component: () => import(/* webpackChunkName: 'async-admin' */'@/admin/index/JudgeServer.vue')
        },
        {
          path: 'index',
          name: 'admin-index',
          component: () => import(/* webpackChunkName: 'async-admin' */'@/admin/index/index.vue')
        },
        {
          path: 'admin-announcement',
          name: 'admin-announcement',
          component: () => import(/* webpackChunkName: 'async-admin' */'@/admin/normal/Announcement.vue')
        },
        {
          path: 'problems-list',
          name: 'problems-list',
          component: () => import(/* webpackChunkName: 'async-admin' */'@/admin/problems/ProblemList.vue')
        },
        {
          path: 'create-problem',
          name: 'create-problem',
          component: () => import(/* webpackChunkName: 'async-admin' */'@/admin/problems/CreateProblem.vue')
        },
        {
          path: 'create-contest',
          name: 'create-contest',
          component: () => import(/* webpackChunkName: 'async-admin' */'@/admin/contests/CreateContest.vue')
        },
        {
          path: 'recommend-paper',
          name: 'recommend-paper',
          component: () => import(/* webpackChunkName: 'async-admin' */'@/admin/innovate/RecommendProblem.vue')
        },
        {
          path: 'contests-list',
          name: 'contests-list',
          component: () => import(/* webpackChunkName: 'async-admin' */'@/admin/contests/ContestsList.vue')
        },
        {
          path: 'contest-problems/:id',
          name: 'contest-problems',
          component: () => import(/* webpackChunkName: 'async-admin' */'@/admin/contests/ContestProblems.vue')
        },
        {
          path: 'contest-member/:id',
          name: 'contest-member',
          component: () => import(/* webpackChunkName: 'async-admin' */'@/admin/contests/ContestMember.vue')
        },
        {
          path: 'group-list',
          name: 'group-list',
          component: () => import(/* webpackChunkName: 'async-admin' */'@/admin/groups/GroupList.vue')
        },
        {
          path: 'create-group',
          name: 'create-group',
          component: () => import(/* webpackChunkName: 'async-admin' */'@/admin/groups/CreateGroup.vue')
        },
        {
          path: 'user-manager',
          name: 'user-manager',
          component: () => import(/* webpackChunkName: 'async-admin' */'@/admin/users/UserManager.vue')
        }
      ]
    }
  ]
});

export default router;
