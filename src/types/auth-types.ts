export enum UserRole {
    BASIC = "BASIC",
    AGENT = "AGENT",
    ADMIN = "ADMIN"
}

export type AuthUserType = {
    userId: string,
    email: string,
    role: UserRole,
    firstName: string;
    lastName: string;
}

export type LoginParams = { email: string, password: string }
export type SignupParams = { email: string, password: string, firstName: string, lastName: string, role: UserRole }

export type AuthDataParams = { token: string, user: AuthUserType, isFirstTime: boolean }
