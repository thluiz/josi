import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [

    {
        path: '/diary', title: 'Diário',
        icon: 'ft-monitor',
        class: '', badge: '',
        badgeClass: '', isExternalLink: false,
        submenu: []
    },
    {
        path: '/people/members', title: 'Painéis',
        icon: 'icon-users',
        class: '', badge: '',
        badgeClass: '', isExternalLink: false,
        submenu: []
    },
    {
        path: '/under-construction', title: 'Calendário',
        icon: 'ft-calendar',
        class: '', badge: '',
        badgeClass: '', isExternalLink: false,
        submenu: []
    },
    {
        path: '/financial', title: 'Financeiro',
        icon: 'icon-wallet',
        class: '', badge: '',
        badgeClass: '', isExternalLink: false,
        submenu: []
    }
];
