"use client";
import React from "react";
import Link from "next/link";
import { useState } from "react"
import { useRouter } from "next/navigation";


import Button, { ButtonVariant } from "../components/Button";

// API
import { LoginAPI } from "../api/auth.api";
import { useMutation } from "@tanstack/react-query";

const Login = () => {
  const router = useRouter()

  const [formData, setFormData] = useState<{
    emailOrUsername: string,
    password: string
  }>({emailOrUsername: '', password: ''})
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)


  // Mutations
  const loginMutation = useMutation({
    mutationFn: LoginAPI,
    onSuccess: (data) => {
      if(data.ok){
        router.push('/')
      }
    },
    onError: (err) => {
    } 
  })


  return (
    <div className="xl:w-[30vw] lg:w-[35vw] md:w-[50vw] w-[70vw] h-[70vh] mx-auto mt-12 rounded-xl shadow-xl bg-white border border-primary-border flex flex-col py-4 px-4 gap-5">
      <span className="text-center font-bold text-2xl">Login</span>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Email or Username"
          className="border border-primary-border px-2 rounded-md py-1 outline-none shadow-sm"
          onChange={(e) => {
            setFormData({...formData, emailOrUsername: e.target.value })
          }}
        />

        <div className="flex flex-col items-end w-full gap-2">
          <input
            type={isPasswordVisible?'text':'password'}
            placeholder="Password"
            className="border w-full border-primary-border px-2 rounded-md py-1 outline-none shadow-sm"
            onChange={(e) => {
              setFormData({...formData, password: e.target.value })
            }}
          />
          <button className="text-sm font-medium cursor-pointer outline-none" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>{isPasswordVisible?'Hide Password':'Show Password'}</button>
        </div>
      </div>

      <Button variant={ButtonVariant.BlackPrimary} isPending={loginMutation.isPending} isPendingTxt="Wait..." onClick={() => {
        if(!formData.emailOrUsername || !formData.password) return;

        loginMutation.mutate(formData)
      }}>Login</Button>

      <div className="w-full flex gap-2 items-center justify-center">
        <div className="bg-gray-600 w-full h-0.5"></div>
        <span className="text-lg font-semibold text-gray-600">OR</span>
        <div className="bg-gray-600 w-full h-0.5"></div>
      </div>

      <div className="flex items-center justify-center">  
        <span>Don't have an account</span>
        <Link href={"/signup"} className="text-purple-600  hover:underline">Sign-Up</Link>
      </div>
    </div>
  );
};

export default Login;
