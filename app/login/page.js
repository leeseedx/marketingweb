"use client";

import React, { useEffect, useState } from "react";
import { Button, Input, Checkbox, Link, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,useDisclosure } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { createClient } from "@/utils/supabase/client";

export default function Component() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error logging in:", error.message);
      onOpen()
    } else {
      console.log("Logged in successfully");
      window.location.href = "/";
    }
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <div className="flex h-[100vh] w-[100vw] items-center justify-center">
        <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
          <p className="pb-4 text-3xl font-semibold text-center">
            <div className="flex justify-center">
              <img src="/images/logo.png" alt="" width="200" />
            </div>
          </p>
          <div className="flex flex-col gap-4">
            <Input
              label="이메일"
              labelPlacement="outside"
              name="email"
              placeholder="이메일을 입력해주세요"
              type="email"
              variant="bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="비밀번호"
              labelPlacement="outside"
              name="password"
              placeholder="비밀번호를 입력해주세요"
              type={isVisible ? "text" : "password"}
              variant="bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex items-center justify-end px-1 py-2">
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
              로그인
            </Button>
          </div>
          {/* <p className="text-center text-small font-bold">
            <Link  href="/register" size="sm">
              가입하기
            </Link>
          </p> */}
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
                <p>
                아이디 비밀번호를 재확인해주세요
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
