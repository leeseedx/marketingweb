"use client";

import React from "react";
import {Link, Spacer} from "@nextui-org/react";
import {Icon} from "@iconify/react";

import {AcmeIcon} from "./social";

const navLinks = [
  {
    name: "Home",
    href: "#",
  },
  {
    name: "About",
    href: "#",
  },
  {
    name: "Services",
    href: "#",
  },
  {
    name: "Projects",
    href: "#",
  },
  {
    name: "Contact",
    href: "#",
  },
  {
    name: "Blog",
    href: "#",
  },
  {
    name: "Careers",
    href: "#",
  },
];

const socialItems = [
  {
    name: "Facebook",
    href: "#",
    icon: (props) => <Icon {...props} icon="fontisto:facebook" />,
  },
  {
    name: "Instagram",
    href: "#",
    icon: (props) => <Icon {...props} icon="fontisto:instagram" />,
  },
  {
    name: "Twitter",
    href: "#",
    icon: (props) => <Icon {...props} icon="fontisto:twitter" />,
  },
  {
    name: "GitHub",
    href: "#",
    icon: (props) => <Icon {...props} icon="fontisto:github" />,
  },
  {
    name: "YouTube",
    href: "#",
    icon: (props) => <Icon {...props} icon="fontisto:youtube" />,
  },
];

export default function Component() {
  return (
    <footer className="flex w-full flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 py-12 lg:px-8">
        <div className="flex items-center justify-center">
          {/* <AcmeIcon size={44} /> */}
          <img src="/images/logo.png" alt="logo" className="w-1/5" />
        </div>
        <Spacer y={6} />
        <div className="flex justify-center gap-x-4">
          {socialItems.map((item) => (
            <Link key={item.name} isExternal className="text-default-400" href={item.href}>
              <span className="sr-only">{item.name}</span>
              <item.icon aria-hidden="true" className="w-5" />
            </Link>
          ))}
        </div>
        <Spacer y={4} />
        <p className="mt-1 text-center text-small text-default-400">
          &copy; 2024 LEESEEDX. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
