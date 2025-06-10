"use client";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import PrimaryBtn from "@/components/Buttons/PrimaryBtn";
import React from "react";
import { LOGIN_URL } from "@/utils/urls";
import http from "@/utils/http";

export default function Home() {
  async function login(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email");
    const password = formData.get("password");
    const data = await http.post(LOGIN_URL, {
      email: email,
      password: password,
    });

    console.log(data);
  }

  return (
    <section className="w-full bg-white min-h-screen lg:p-12">
      <div className="w-full max-w-lg py-6 px-2">
        <Image
          src={logo}
          alt="LearningPost Logo"
          width={220.0}
          // className="mx-auto"
        />
        <form
          method="post"
          onSubmit={(e) => {
            login(e);
          }}
          className="px-3 mt-3 flex flex-col gap-4"
        >
          <input
            type="email"
            name="email"
            id="email"
            className="w-full bg-gray-200 rounded-lg py-4 px-4 text-black/80 placeholder:text-black/60"
            placeholder="Email Address:"
            required
          />
          <input
            type="password"
            name="password"
            id="password"
            className="w-full bg-gray-200 rounded-lg py-4 px-4 text-black/80 placeholder:text-black/60"
            placeholder="Password:"
            required
          />
          <div className="w-4/6 mx-auto mt-2">
            <PrimaryBtn
              type="submit"
              textContent="Login"
              btnWidth="w-full"
              onClick={() => {}}
            />
          </div>
        </form>
      </div>
    </section>
  );
}
