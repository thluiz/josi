import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [

    {
        path: '/outlook/weekly', title: 'Diário',
        icon: 'ft-monitor',
        class: '', badge: '',
        badgeClass: '', isExternalLink: false,
        submenu: [ ]
    },
    {
        path: '/people', title: 'Painel',
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
        path: '/under-construction', title: 'Financeiro',
        icon: 'icon-wallet',
        class: '', badge: '',
        badgeClass: '', isExternalLink: false,
        submenu: []
    }
];
