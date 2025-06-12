export interface User {
    id: number;
    name: string;
    email: string;
    roles: string[]; // Array of role names
    permissions: string[]; // Array of permission names
    // tambahkan field lain yang diperlukan
}
