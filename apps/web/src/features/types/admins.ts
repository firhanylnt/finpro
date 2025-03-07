export interface Admin {
    id: number;
    fullname: string;
    email: string;
    roles: {
        name: string;
    };
    store: {
        name: string;
    };
    createdAt: Date;
}

export interface Users {
    id: number;
    fullname: string;
    email: string;
    phone_number: number;
    status: boolean;
    createdAt: Date;
}