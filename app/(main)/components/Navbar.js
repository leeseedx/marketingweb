"use client";
import React, { useEffect, useState } from "react";
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
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  console.log(pathname);
  const menuItems = [
    {
      href: "/",
      label: "인플루언서 리스트",
    },
    {
      href: "/project",
      label: "프로젝트 관리",
    },
    {
      href: "/account",
      label: "고객사 계정 관리",
    },
    {
      href: "/contract",
      label: "계약자 관리",
    },
  ];
  const supabase = createClient();
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
      console.log("user:", user);
    };
    getUser();
    setUser(user);
    setIsLoading(false);
    console.log("user:", user);
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("error:", error);
    }
  if (!error) {
    window.location.href = "/login";
  }
  };

  console.log("user111:", user);
  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className="w-full font-bold">
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
          {isLoading ? null : (
            user ? (
              <div className="flex justify-center items-center gap-2">
              <div className="font-medium">{user.email}</div>
              <Button
                as={Link}
                color="primary"
                href="/login"
                className="font-bold"
                onClick={()=>{
                  handleSignOut()
                }}
              >
                로그아웃
              </Button>
              </div>
            ) : (
              <></>
            )
          )}
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
              
              className="w-full text-black"
              href={item.href}
              size="lg"
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
