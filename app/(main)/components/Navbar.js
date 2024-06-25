"use client";
import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  Image,
} from "@nextui-org/react";
import { useState } from "react";
import { usePathname } from "next/navigation";


export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  console.log(pathname);
  const menuItems = [
    "인플루언서 리스트",
    "프로젝트 관리",
    "고객사 계정 관리",
    "계약자 관리",
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className="w-full">
      <NavbarContent className="w-full">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/">
            {/* <p className="font-bold text-inherit text-primary text-2xl">LEESEEDX</p> */}
            {/* <Image
              width={150}
              alt="NextUI hero Image"
              src="/images/logo.png"
              radius="none"
            /> */}
            <div>
            <img src="/images/logo.png" alt="" width="150" />
            </div>
            
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link
            href="/"
            className={`${
              pathname === "/" ? "font-bold text-primary" : "text-black"
            }`}
          >
            인플루언서 리스트
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="/project"
            className={`${
              pathname === "/project" ? "font-bold text-primary" : "text-black"
            }`}
          >
            프로젝트 관리
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="/account"
            className={`${
              pathname.startsWith("/account")
                ? "font-bold text-primary"
                : "text-black"
            }`}
          >
            고객사 계정 관리
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="/contract"
            className={`${
              pathname === "/contract" ? "font-bold text-primary" : "text-black"
            }`}
          >
            계약자 관리
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          {/* <Link href="/login">로그인</Link> */}
          <Button as={Link} color="primary" href="/login"  className="font-bold">
            로그인
          </Button>
        </NavbarItem>
        {/* <NavbarItem>
          <Button as={Link} color="primary" href="/register" variant="flat">
            회원가입
          </Button>
        </NavbarItem> */}
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              className="w-full"
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
