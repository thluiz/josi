import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [

    {
        path: '/daily', title: 'Diário',
         icon: 'icon-notebook',
         class: '', badge: '',
         badgeClass: '', isExternalLink: false,
         submenu: []
    },
    {
        path: '/financial-dashboard', title: 'Financeiro',
         icon: 'icon-wallet',
         class: '', badge: '',
         badgeClass: '', isExternalLink: false,
         submenu: []
    },
    {
        path: '/members-dashboard', title: 'Membros',
         icon: 'icon-users',
         class: '', badge: '',
         badgeClass: '', isExternalLink: false,
         submenu: []
    }    
];
