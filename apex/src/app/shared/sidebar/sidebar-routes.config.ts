import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [

    {
        path: '/outlook/weekly', title: 'Panorama',
        icon: 'ft-monitor',
        class: '', badge: '',
        badgeClass: '', isExternalLink: false,
        submenu: [
            { path: '/outlook/weekly', 
                title: 'Semana', icon: '', 
                class: '', badge: '', badgeClass: '', 
                isExternalLink: false, submenu: [] },             
            { path: '/outlook/sumary', 
                title: 'Sumário', icon: '', 
                class: '', badge: '', badgeClass: '', 
                isExternalLink: false, submenu: [] },             
         ]
    },
    {
        path: '/people', title: 'Pessoas',
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
    },
    {
        path: '/under-construction', title: 'Parâmetros',
        icon: 'icon-settings',
        class: '', badge: '',
        badgeClass: '', isExternalLink: false,
        submenu: []
    }    
];
