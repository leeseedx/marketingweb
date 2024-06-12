'use client'
import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button} from "@nextui-org/react";
import {useState} from "react";
import { usePathname } from "next/navigation";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname=usePathname()
  console.log(pathname)
  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className="w-4/5 mx-auto">
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/">
          <p className="font-bold text-inherit text-primary">LEESEEDX</p>
          </Link>
          
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link href="/" className={`${pathname === "/" ? "font-bold text-primary" : "text-black"}`}>
            인플루언서 리스트
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/project" className={`${pathname === "/project" ? "font-bold text-primary" : "text-black"}`}>
            프로젝트 관리
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/account" className={`${pathname === "/account" ? "font-bold text-primary" : "text-black"}`}>
            고객사 계정 관리
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/contract" className={`${pathname === "/contract" ? "font-bold text-primary" : "text-black"}`}>
            계약자 관리
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="/login">로그인</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="/register" variant="flat">
            회원가입
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
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
