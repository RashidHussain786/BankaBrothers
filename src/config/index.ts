const ENV = process.env.NODE_ENV || 'development';

const config = {
    development: {
        API_BASE_URL: 'http://localhost:3001/api'
    },
    production: {
        API_BASE_URL: '/api' // This will use the relative path in production
    }
} as const;

export const API_BASE_URL = config[ENV as keyof typeof config].API_BASE_URL;

export const REQUIRED_FIELDS = [
    'id',
    'name',
    'company',
    'category',
    'brand',
    'unitSize',
    'size',
    'stockQuantity',
];