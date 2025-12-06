import api from "../config/api.config";


interface ISignUp {
    username: string,
    email: string,
    password: string
}

export const LoginAPI =async ({emailOrUsername, password}:{emailOrUsername:string, password:string}) => {
    const res = await api.get(`auth/login?usernameOrEmail=${emailOrUsername}&password=${password}`)
    return await res.data
}

export const SignUpAPI =async (signUpData:ISignUp) => {
    const res = await api.post(`auth/signup`, {
        ...signUpData
    })
    return await res.data
}


