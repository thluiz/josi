"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Route for content layout without sidebar, navbar and footer for pages like Login, Registration etc...
exports.CONTENT_ROUTES = [
    {
        path: 'content-layout',
        loadChildren: './pages/content-layout-page/content-pages.module#ContentPagesModule'
    },
    {
        path: 'login_error',
        loadChildren: './pages/login_error/login-error.module#LoginErrorModule'
    },
    {
        path: 'default_route',
        loadChildren: './pages/default-route/default-route.module#DefaultRouteModule'
    }
];
//# sourceMappingURL=content-layout.routes.js.map