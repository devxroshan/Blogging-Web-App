"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import Button, { ButtonVariant } from "./Button";

const Navbar = () => {
  const navLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Explore",
      path: "/explore",
    },
    {
      name: "Categories",
      path: "/categories",
    },
    {
      name: "About",
      path: "/about",
    },
  ];
  const settingMenu = [
    {
      name: "Dashboard",
    },
    {
      name: "Posts",
    },
    {
      name: "Saved",
    },
    {
      name: "Archive",
    },
    {
      name: "Liked Posts",
    },
  ];

  const [isNavOpened, setNavOpened] = useState<boolean>(false);
  const [isSettingMenu, setSettingMenu] = useState<boolean>(false);



  return (
    <header className="w-screen">
      <nav className="flex items-center justify-between w-screen h-14 shadow-md border border-b-primary-border px-3 py-1 select-none">
        <div className="flex gap-4">
          <Image
            src={"/menu-icon.png"}
            width={24}
            height={24}
            alt="Menu Icon"
            className="cursor-pointer active:scale-90 hover:drop-shadow-sm transition-all duration-300 lg:hidden"
            onClick={() => setNavOpened(true)}
          />
          <span className="font-extrabold text-xl">blogit.</span>
        </div>

        <div className="gap-4 items-center justify-center hidden lg:flex">
          {navLinks.map((link) => (
            <Link href={link.path} key={link.path} className="font-medium hover:-translate-y-0.5 transition-all duration-300 hover:text-shadow-lg">
              {link.name}
            </Link>
          ))}
        </div>

        <div
          className="flex items-center justify-start w-54 h-12 border border-primary-border rounded-lg shadow-sm px-2 gap-2 hover:bg-gray-200 cursor-pointer transition-all duration-300 select-none"
          onClick={() => setSettingMenu(!isSettingMenu)}
        >
          <Image
            src={"/test.png"}
            width={35}
            height={35}
            alt="Profile Pic"
            className="rounded-full"
          />
          <div className="flex flex-col items-start select-none">
            <span className="font-semibold text-sm">Roshan Kewat</span>
            <span className="font-medium text-gray-700 text-xs">
              devxroshan
            </span>
          </div>
        </div>
      </nav>

      {isNavOpened && (
        <div className="w-56 h-screen bg-white border border-r-primary-border fixed z-10 -mt-14 flex flex-col gap-4 items-center justify-start py-4 lg:hidden">
          <div className="flex justify-between items-center px-4 w-full">
            <span className="font-extrabold text-xl">blogit.</span>

            <Image
              src={"/cross-icon.png"}
              width={25}
              height={25}
              alt="Cross"
              className="hover:bg-gray-200 rounded-lg p-0.5 cursor-pointer transition-all duration-300 active:scale-90"
              onClick={() => setNavOpened(false)}
            />
          </div>

          <div className="flex flex-col gap-2 items-start justify-start mt-12 w-full px-3">
            {navLinks.map((link) => (
              <Link
                href={link.path}
                key={link.path}
                className="font-medium py-2 transition-all duration-300 hover:bg-gray-200 w-full px-4 rounded-md active:scale-90 hover:shadow-md"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {isSettingMenu && (
        <div className="sticky rounded-xl shadow-lg ml-auto mr-2 w-56 h-96 flex bg-white border border-primary-border flex-col gap-4 px-3 py-3">
          <div className="bg-white border border-primary-border w-full rounded-xl py-1.5 px-2 flex gap-2 items-center justify-start cursor-pointer hover:bg-gray-200 transition-all duration-300 shadow-sm">
            <Image
              src={"/test.png"}
              width={40}
              height={40}
              alt="Profile Pic"
              className="rounded-full"
            />

            <div className="flex flex-col items-start justify-start select-none">
              <span className="font-medium text-sm">Roshan Kewat</span>
              <span className="font-medium text-xs text-gray-800">
                devxroshan
              </span>
            </div>
          </div>

          <div className="flex w-full flex-col items-start justify-start gap-2">
            {settingMenu.map((setting) => (
              <button
                key={setting.name}
                className="py-2 hover:bg-gray-200 transition-all duration-300 w-full text-left px-3 rounded-xl cursor-pointer hover:font-medium hover:shadow-sm"
              >
                {setting.name}
              </button>
            ))}
          </div>

          <Button variant={ButtonVariant.BlackPrimary}>Create</Button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
