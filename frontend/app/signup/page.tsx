"use client";
import React, { useState } from "react";
import Link from "next/link";

import Button, { ButtonVariant } from "../components/Button";
import { SchemaValidator } from "../utils/schemaValidator.utils";
import { SignUpSchema } from "../schemas/signup.schema";
import { useMutation } from "@tanstack/react-query";
import { SignUpAPI } from "../api/auth.api";

interface ISignUp {
  username: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState<ISignUp>({
    username: "",
    email: "",
    password: "",
  });
  const [isSignedUp, setIsSignedUp] = useState<boolean>(true);

  // Mutations
  const signUpMutatiton = useMutation({
    mutationFn: SignUpAPI,
    onSuccess: (data) => {
      if (data.ok) {
        setIsSignedUp(true);
      }
    },
    onError: (err) => {},
  });

  return (
    <>
      {!isSignedUp && (
        <div className="xl:w-[30vw] lg:w-[35vw] md:w-[50vw] w-[70vw] h-[85vh] mx-auto mt-12 border border-primary-border rounded-xl shadow-xl flex flex-col gap-3 px-2 py-2 select-none">
          <span className="text-center font-bold text-2xl">Sign Up</span>

          <div className="w-full flex flex-col gap-2">
            <input
              type="text"
              className="outline-none px-2 py-1 rounded-lg shadow-sm border border-primary-border"
              placeholder="Username"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  username: e.target.value,
                });
              }}
            />
            <input
              type="text"
              className="outline-none px-2 py-1 rounded-lg shadow-sm border border-primary-border"
              placeholder="Email"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  email: e.target.value,
                });
              }}
            />

            <div className="flex flex-col items-end justify-center gap-1">
              <input
                type={isPasswordVisible ? "text" : "password"}
                className="outline-none px-2 py-1 rounded-lg shadow-sm w-full border border-primary-border"
                placeholder="Password"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  });
                }}
              />
              <button
                className="cursor-pointer text-sm font-medium outline-none"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? "Hide Password" : "Show Password"}
              </button>
            </div>
          </div>

          <Button
            variant={ButtonVariant.BlackPrimary}
            isPending={signUpMutatiton.isPending}
            isPendingTxt="Wait..."
            onClick={() => {
              const isValid = SchemaValidator(SignUpSchema, formData);
              if (isValid == true) {
                signUpMutatiton.mutate(formData);
              } else {
                console.log(isValid);
              }
            }}
          >
            SignUp
          </Button>

          <div className="w-full flex gap-2 items-center justify-center">
            <div className="bg-gray-600 w-full h-0.5"></div>
            <span className="text-lg font-semibold text-gray-600">OR</span>
            <div className="bg-gray-600 w-full h-0.5"></div>
          </div>

          <div className="flex items-center justify-center">
            <span>Already have an account</span>
            <Link href={"/login"} className="text-purple-600  hover:underline">
              Log-in
            </Link>
          </div>
        </div>
      )}

      {isSignedUp && (
        <div className="xl:w-[30vw] lg:w-[35vw] md:w-[50vw] w-[70vw] h-[85vh] mx-auto mt-12 border border-primary-border rounded-xl shadow-xl flex flex-col gap-3 px-2 py-2 select-none items-center justify-center">
          <span className="text-center font-bold text-xl">
            We have sent you a mail for email confirmation. Check your inbox or
            spam folder
          </span>

          <Link
            href={"https://mail.google.com/mail/u/0/#inbox/"}
            className="bg-black rounded-lg text-white px-4 py-2 font-medium"
            target="_blank"
          >
            Go to Mail
          </Link>

          <Link
            href={"/login"}
            className="rounded-lg border border-primary-border text-black px-4 py-2 font-medium hover:bg-black hover:text-white hover:border-none transition-all duration-300"
          >
            Login
          </Link>
        </div>
      )}
    </>
  );
};

export default SignUp;
