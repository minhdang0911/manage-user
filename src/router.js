import { createWebHistory, createRouter } from 'vue-router';
import Home from './components/Home.vue';
import SignUp from './components/SignUp.vue';
import Login from './components/Login.vue';
import UpdateUser from './components/UpdateUser.vue';

const routes = [
    {
        name: 'Home',
        component: Home,
        path: '/',
    },
    {
        name: 'signup',
        component: SignUp,
        path: '/signup',
    },

    {
        name: 'login',
        component: Login,
        path: '/login',
    },
    {
        name: 'updateUser',
        component: UpdateUser,
        path: '/update-user/:id',
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
