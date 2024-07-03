"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Checkbox,
  Link,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { createClient } from "@/utils/supabase/client";



export default function Component() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Component가 마운트될 때 localStorage에서 저장된 값을 가져옴
    const savedUsername = localStorage.getItem("username");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedRememberMe) {
      setEmail(savedUsername || "");
      setRememberMe(savedRememberMe);
    }
  }, []);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async () => {

    if (rememberMe) {
      localStorage.setItem('username', email);
      localStorage.setItem('rememberMe', rememberMe);
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('rememberMe');
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error logging in:", error.message);
      onOpen();
    } else {
      console.log("Logged in successfully");
      window.location.href = "/";
      const { data, error: logError } = await supabase
        .from("activitylog")
        .insert([{ account:email, action: "접속", created_at: new Date()}]);

      if (logError) {
        console.error("Error logging activity:", logError.message);
      } else {
        console.log("Activity logged successfully");
      }
    }
  };

  if (!isHydrated) {
    return null;
  }


  return (
    <>
      <div className="flex h-[100vh] w-[100vw] items-center justify-center">
        <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
          <div className="flex justify-center mb-8">
            <img src="/images/logo.png" alt="" width="200" />
          </div>

          <h1 className="text-center text-2xl font-bold">LOGIN</h1>
          <div className="flex flex-col gap-4">
            <Input
              label="EMAIL"
              labelPlacement="outside"
              name="email"
              placeholder="이메일을 입력해주세요"
              type="email"
              variant="bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="PASSWORD"
              labelPlacement="outside"
              name="password"
              placeholder="비밀번호를 입력해주세요"
              type={isVisible ? "text" : "password"}
              variant="bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex items-center justify-end px-1 py-2">
              <Checkbox
                defaultSelected
                onChange={(e) => setRememberMe(e.target.checked)}
              >
                아이디 저장하기
              </Checkbox>
              {/* <Checkbox defaultSelected name="remember" size="sm">
                Remember me
              </Checkbox> */}
              {/* <Link className="text-default-500" href="#" size="sm">
                비밀번호를 잃어버렸어요
              </Link> */}
            </div>
            <Button
              className="font-bold bg-[#b12928]"
              color="primary"
              type="submit"
              onClick={handleLogin}
            >
              Login
            </Button>
          </div>
          <p className="text-center">* 로그인 후 이용해주시기 바랍니다</p>
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                로그인 실패
              </ModalHeader>
              <ModalBody>
                <p>아이디 비밀번호를 재확인해주세요</p>
              </ModalBody>
              <ModalFooter>
                <Button className="bg-[#b12928] text-white" onPress={onClose}>
                  확인
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
