'use client';
import React from 'react'

export enum ButtonVariant {
    BlackPrimary
}

interface ButtonProps {
    variant: ButtonVariant,
    children: string,
    isPendingTxt?: string,
    isPending?: boolean,
    onClick?: () => void
}

const Button:React.FC<ButtonProps> = ({variant, children, onClick, isPending, isPendingTxt}) => {
    if(isPending && !isPendingTxt) throw new Error('isPendingTxt is required if you use isPending.')

  return (
    variant == ButtonVariant.BlackPrimary?<button className={`w-full select-none text-white py-1.5 rounded-lg cursor-pointer hover:bg-gray-900 transition-all duration-500 active:scale-90 hover:shadow-lg ${isPending?'bg-gray-800 cursor-default':'bg-black'}`} disabled={isPending} onClick={onClick}>{isPending?isPendingTxt:children}</button>:null
  )
}

export default Button