import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [

    {
        path: '/diary', title: 'Diário',
        icon: 'ft-monitor has-sub open',
        class: '', badge: '',
        badgeClass: '', isExternalLink: false,
        submenu: [
            {
                path: '/diary/agenda', title: 'Agenda',
                icon: '',
                class: '', badge: '',
                badgeClass: '', isExternalLink: false,
                submenu: [] 
            },
            {
                path: '/diary/week', title: 'Semana',
                icon: '',
                class: '', badge: '',
                badgeClass: '', isExternalLink: false,
                submenu: [] 
            },
            {
                path: '/organizations', title: 'Gestores',
                icon: '',
                class: '', badge: '',
                badgeClass: '', isExternalLink: false,
                submenu: [] 
            }
        ]
    },
    {
        path: '/people/members', title: 'Painéis',
        icon: 'icon-users has-sub open',
        class: '', badge: '',
        badgeClass: '', isExternalLink: false,
        submenu: [
            {
                path: '/people/members', title: 'Membros',
                icon: '',
                class: '', badge: '',
                badgeClass: '', isExternalLink: false,
                submenu: [
                    {
                        path: '/people/members/management', title: 'Gerenciamento',
                        icon: '',
                        class: '', badge: '',
                        badgeClass: '', isExternalLink: false,
                        submenu: [] 
                    }
                ] 
            }, {
                path: '/people/voucher', title: 'Convidados',
                icon: '',
                class: '', badge: '',
                badgeClass: '', isExternalLink: false,
                submenu: [] 
            }, 
            {
                path: '/people/interested', title: 'Interessados',
                icon: '',
                class: '', badge: '',
                badgeClass: '', isExternalLink: false,
                submenu: [] 
            }, 
            {
                path: '/people/away', title: 'Afastados',
                icon: '',
                class: '', badge: '',
                badgeClass: '', isExternalLink: false,
                submenu: [] 
            },
            {
                path: '/people/service_provider', title: 'Prestadores de Serviço',
                icon: '',
                class: '', badge: '',
                badgeClass: '', isExternalLink: false,
                submenu: [] 
            },
            {
                path: '/under-construction', title: 'Não Interessados',
                icon: 'icon-ban',
                class: '', badge: '',
                badgeClass: '', isExternalLink: false,
                submenu: [] 
            },                
        ]
    },
    {
        path: '/under-construction', title: 'Calendário',
        icon: 'icon-ban',
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
    },
    {
        path: '/parameters', title: 'Parâmetros',
        icon: 'ft-settings',
        class: '', badge: '',
        badgeClass: '', isExternalLink: false,
        submenu: []
    }
];
