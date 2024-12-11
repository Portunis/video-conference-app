import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { loadLayoutMiddleware } from '@/app/provides/router/middleware/loadLayout.middleware'
// import supabase from '@/shared/supabase/initSupabase'


export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})
// async function getUser(next: any) {
//     const localUser = await supabase.auth.getSession();
//     console.log('123',localUser)
//     if (localUser.data.session == null) {
//         next('/auth')
//     }
//     else {
//         next();
//     }
// }
// async function checkAuth(next: any) {
//     const localUser = await supabase.auth.getSession();
//     console.log('124',localUser)
//     if (localUser.data.session !== null) {
//         next('/')
//     }
//     else {
//         next();
//     }
// }
//
//
// router.beforeEach((to, from, next) => {
//     if (to.meta.needsAuth) {
//         getUser(next).then(() => {});
//     }
//     else {
//         next();
//     }
// })
// router.beforeEach((to, from, next) => {
//     if (to.meta.checkAuth) {
//         checkAuth(next).then(() => {});
//     }
//     else {
//         next();
//     }
// })
router.beforeEach(loadLayoutMiddleware)