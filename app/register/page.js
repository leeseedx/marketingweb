"use client";

import React from "react";
import {Button, Input, Checkbox, Link} from "@nextui-org/react";
import {Icon} from "@iconify/react";

export default function Component() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  return (
    <div className="flex h-[100vh] w-[100vw] items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
        <p className="pb-4 text-center text-3xl font-semibold">
          회원가입
          <span aria-label="emoji" className="ml-2" role="img">
            👋
          </span>
        </p>
        <div className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <Input
            isRequired
            label="이메일"
            labelPlacement="outside"
            name="email"
            placeholder="이메일을 입력해주세요"
            type="email"
            variant="bordered"
          />
          <Input
            isRequired
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="비밀번호"
            labelPlacement="outside"
            name="password"
            placeholder="비밀번호를 입력해주세요"
            type={isVisible ? "text" : "password"}
            variant="bordered"
          />
          <Input
            isRequired
            endContent={
              <button type="button" onClick={toggleConfirmVisibility}>
                {isConfirmVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="비밀번호 확인"
            labelPlacement="outside"
            name="confirmPassword"
            placeholder="비밀번호를 재입력해주세요"
            type={isConfirmVisible ? "text" : "password"}
            variant="bordered"
          />
          
          <Button className='font-bold' color="primary" type="submit">
            회원가입
          </Button>
        </div>
        <p className="text-center text-small font-bold">
          <Link href="/login" size="sm">
            이미 계정이 있어요
          </Link>
        </p>
      </div>
    </div>
  );
}
