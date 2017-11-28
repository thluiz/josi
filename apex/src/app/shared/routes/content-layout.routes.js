"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Route for content layout without sidebar, navbar and footer for pages like Login, Registration etc...
exports.CONTENT_ROUTES = [
    {
        path: 'content-layout',
        loadChildren: './pages/content-layout-page/content-pages.module#ContentPagesModule'
    }
];
//# sourceMappingURL=content-layout.routes.js.map