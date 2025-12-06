'use client';
import React, {useState} from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

interface QueryWrapperProps {
    children: React.ReactNode
}


const QueryWrapper:React.FC<QueryWrapperProps> = ({children}) => {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export default QueryWrapper