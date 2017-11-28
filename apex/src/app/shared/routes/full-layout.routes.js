"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Route for content layout with sidebar, navbar and footer
exports.Full_ROUTES = [
    {
        path: 'changelog',
        loadChildren: './changelog/changelog.module#ChangeLogModule'
    },
    {
        path: 'full-layout',
        loadChildren: './pages/full-layout-page/full-pages.module#FullPagesModule'
    }
];
//# sourceMappingURL=full-layout.routes.js.map