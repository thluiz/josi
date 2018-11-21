import { RouteInfo } from "./sidebar.metadata";

export const ROUTES: RouteInfo[] = [
  {
    path: "/diary",
    title: "Diário",
    icon: "ft-monitor has-sub open",
    class: "",
    badge: "",
    badgeClass: "",
    isExternalLink: false,
    submenu: [
      {
        path: "/diary/agenda",
        title: "Agenda",
        icon: "",
        class: "",
        badge: "",
        badgeClass: "",
        isExternalLink: false,
        submenu: []
      },
      {
        path: "/diary/week",
        title: "Semana",
        icon: "",
        class: "",
        badge: "",
        badgeClass: "",
        isExternalLink: false,
        submenu: []
      },
      {
        path: "/organizations",
        title: "Gestores",
        icon: "",
        class: "",
        badge: "",
        badgeClass: "",
        isExternalLink: false,
        submenu: []
      }
    ]
  },
  {
    path: "/people/members",
    title: "Painéis",
    icon: "icon-users has-sub open",
    class: "",
    badge: "",
    badgeClass: "",
    isExternalLink: false,
    submenu: [
      {
        path: "/people/members/management",
        title: "Membros",
        icon: "",
        class: "",
        badge: "",
        badgeClass: "",
        isExternalLink: false,
        submenu: []
      },
      {
        path: "/people/external_contacts",
        title: "Contatos Externos",
        icon: "",
        class: "",
        badge: "",
        badgeClass: "",
        isExternalLink: false,
        submenu: []
      },
      {
        path: "/people/away",
        title: "Afastados",
        icon: "",
        class: "",
        badge: "",
        badgeClass: "",
        isExternalLink: false,
        submenu: []
      },
      {
        path: "/people/service_provider",
        title: "Prest. Serviços",
        icon: "",
        class: "",
        badge: "",
        badgeClass: "",
        isExternalLink: false,
        submenu: []
      },
      {
        path: "/under-construction",
        title: "Não Interessados",
        icon: "icon-ban",
        class: "",
        badge: "",
        badgeClass: "",
        isExternalLink: false,
        submenu: []
      }
    ]
  },
  {
    path: "/calendar/coverage",
    title: "Calendário",
    icon: "icon-calendar",
    class: "",
    badge: "",
    badgeClass: "",
    isExternalLink: false,
    submenu: [
      {
        path: "/calendar/coverage",
        title: "Cobertura",
        icon: "",
        class: "",
        badge: "",
        badgeClass: "",
        isExternalLink: false,
        submenu: []
      },
      {
        path: "/calendar/events",
        title: "Eventos",
        icon: "",
        class: "",
        badge: "",
        badgeClass: "",
        isExternalLink: false,
        submenu: []
      }
    ]
  },
  {
    path: "/financial",
    title: "Financeiro",
    icon: "icon-wallet",
    class: "",
    badge: "",
    badgeClass: "",
    isExternalLink: false,
    submenu: [
      {
        path: "/under-construction",
        title: "Contas",
        icon: "icon-ban",
        class: "",
        badge: "",
        badgeClass: "",
        isExternalLink: false,
        submenu: []
      }
    ]
  },
  {
    path: "/parameters",
    title: "Parâmetros",
    icon: "ft-settings",
    class: "",
    badge: "",
    badgeClass: "",
    isExternalLink: false,
    submenu: []
  }
];
