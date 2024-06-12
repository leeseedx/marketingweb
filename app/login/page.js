"use client";

import React from "react";
import { Button, Input, Checkbox, Link } from "@nextui-org/react";
import { Icon } from "@iconify/react";



export default function Component() {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (

      <div className="flex h-[100vh] w-[100vw] items-center justify-center">
        <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
          <p className="pb-4 text-3xl font-semibold text-center" >
            로그인
            <span aria-label="emoji" className="ml-2" role="img">
              👋
            </span>
          </p>
          <div
            className="flex flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              label="이메일"
              labelPlacement="outside"
              name="emai"
              placeholder="이메일을 입력해주세요"
              type="email"
              variant="bordered"
            />
            <Input
              label="비밀번호"
              labelPlacement="outside"
              name="password"
              placeholder="비밀번호를 입력해주세요"
              type={isVisible ? "text" : "password"}
              variant="bordered"
            />
            <div className="flex items-center justify-end px-1 py-2">
              {/* <Checkbox defaultSelected name="remember" size="sm">
                Remember me
              </Checkbox> */}
              <Link className="text-default-500" href="#" size="sm">
                비밀번호를 잃어버렸어요
              </Link>
            </div>
            <Button className='font-bold' color="primary" type="submit">
              로그인
            </Button>
          </div>
          <p className="text-center text-small font-bold">
            <Link  href="/register" size="sm">
              가입하기
            </Link>
          </p>
        </div>
      </div>
  );
}
