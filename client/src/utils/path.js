const path = {
    PUBLIC: '/',
    HOME: '',
    ALL: '*',
    LOGIN: 'login',
    PRODUCTS: ':category',
    BLOGS: 'blogs',
    OUR_SERVICES: 'services',
    FAQ: 'faqs',
    PRODUCT_DETAIL__CATEGORY__PID__TITLE: ':category/:pid/:title',
    COMPLETE_REGISTER: 'completeregister/:status',
    RESET_PASSWORD: 'resetpassword/:token',

    // Admin
    ADMIN: 'admin',
    DASHBOARD: 'dashboard',
    MANAGE_PRODUCT: 'manage-products',
    MANAGE_ORDER: 'manage-order',
    MANAGE_USER: 'manage-user',
    CREATE_PRODUCT: 'create-product',

    // Member
    MEMBER: 'member',
    PERSONAL: 'personal',
}

export default path;