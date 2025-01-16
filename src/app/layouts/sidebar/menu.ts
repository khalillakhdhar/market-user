import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'bx-home-circle',
        badge: {
            variant: 'info',
            text: 'MENUITEMS.DASHBOARDS.BADGE',
        },
        subItems: [
            {
                id: 3,
                label: 'MENUITEMS.DASHBOARDS.LIST.DEFAULT',
                link: '/dashboard',
                parentId: 2
            }

        ]
    },
    {
        id: 7,
        isLayout: true
    },
    {
        id: 8,
        label: 'MENUITEMS.APPS.TEXT',
        isTitle: true
    },

    {
        id: 12,
        label: 'MENUITEMS.ECOMMERCE.TEXT',
        icon: 'bx-store',
        subItems: [
            {
                id: 13,
                label: 'MENUITEMS.ECOMMERCE.LIST.PRODUCTS',
                link: '/ecommerce/products',
                parentId: 12
            },

          /*  {
                id: 17,
                label: 'MENUITEMS.ECOMMERCE.LIST.CART',
                link: '/ecommerce/cart',
                parentId: 12
            },
*/
            {
                id: 20,
                label: 'MENUITEMS.ECOMMERCE.LIST.ADDPRODUCT',
                link: '/ecommerce/add-product',
                parentId: 12
            },
        ]
    },


/*
    {
        id: 39,
        label: 'MENUITEMS.PROJECTS.TEXT',
        icon: 'bx-briefcase-alt-2',
        subItems: [

            {
                id: 41,
                label: 'MENUITEMS.PROJECTS.LIST.PROJECTLIST',
                link: '/projects/list',
                parentId: 38
            },

            {
                id: 43,
                label: 'MENUITEMS.PROJECTS.LIST.CREATE',
                link: '/projects/create',
                parentId: 38
            }
        ]
    },
*/
    {
        id: 48,
        label: 'MENUITEMS.CONTACTS.TEXT',
        icon: 'bxs-user-detail',
        subItems: [
  /*          {
                id: 49,
                label: 'MENUITEMS.CONTACTS.LIST.USERGRID',
                link: '/contacts/grid',
                parentId: 48
            },
*/
            {
                id: 51,
                label: 'MENUITEMS.CONTACTS.LIST.PROFILE',
                link: '/contacts/profile',
                parentId: 48
            }
        ]
    },

];
