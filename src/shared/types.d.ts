export interface Menu {
    id?: number
    name: string
    parentId: number | null
}

export interface MenuRequest extends Menu {
    status: number
}

export interface MenuResponse extends Menu {
    children?: MenuResponse[]
}

export interface User {
    id?: number
    username: string
    name: string
    lastname: string
    email: string
    password: string
}

export interface UserRequest extends User {
    status: number
}

export interface UserMenu {
    userId: number
    menuId: number
}