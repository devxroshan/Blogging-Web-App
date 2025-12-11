'use client';
import { useMutation } from "@tanstack/react-query";
import React, { useEffect } from "react";
import {useRouter} from "next/router";
import { usePathname } from "next/navigation";

import { IsLoggedInAPI } from "../api/auth.api";

interface IAuthenticationChecker {
    children: React.ReactNode;
}

const AuthenticationChecker:React.FC<IAuthenticationChecker> = ({children}) => {
    const pathname = usePathname()

    const pathsOmittedOnLogin = ['/login', '/signup']

    const isLoggedInMutation = useMutation({
        mutationFn: IsLoggedInAPI,
        onSuccess: (data) => {
            console.log(data)
            localStorage.setItem('isLoggedIn', data.data?'OK':'NULL')
        },
        onError: (err) => {

        }
    })


    useEffect(() => {
        GetIsLoggedInData()

        if(localStorage.getItem('isLoggedIn') == 'NULL' && !pathsOmittedOnLogin.includes(pathname) && !isLoggedInMutation.isPending){
            window.location.href = '/login'
        }else {
            if(localStorage.getItem('isLoggedIn') == 'OK'&& pathsOmittedOnLogin.includes(pathname) && !isLoggedInMutation.isPending){
                window.location.href = '/'
            }
        }
    }, [])

    const GetIsLoggedInData = async () => {
        await isLoggedInMutation.mutateAsync()
    }
    

    return (
        <>
        {children}
        </>
    )
}

export default AuthenticationChecker;