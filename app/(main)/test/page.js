"use client";
import React from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { animals } from "../components/data";
import { Button } from "@nextui-org/react";
import { createClient } from "@/utils/supabase/client";

export default function App() {
  const [values, setValues] = React.useState(new Set(["cat", "dog"]));

  const supabase = createClient();

  const registerAccount = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: "hellfir2@naver.com",
      password: "dlwndwo2",
    });
    if(error){
      console.log(error);
    }else{
      console.log(data);
    }
  };

  return (
    <div>
      <Button color="primary" onClick={registerAccount}>
        가입
      </Button>
      <Button color="secondary">로그인</Button>
    </div>
  );
}
