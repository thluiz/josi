import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [

    {
        path: '', title: 'Panorama',
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
