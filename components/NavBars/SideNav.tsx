"use client";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import analyticsIcon from "@/assets/icons/analytics.svg";
import contentIcon from "@/assets/icons/content.svg";
import feedbackIcon from "@/assets/icons/feedback.svg";
import partnershipIcon from "@/assets/icons/partnership.svg";
import logoutIcon from "@/assets/icons/logout.svg";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SideNav() {
  const router = useRouter();
  const navLinks = [
    {
      id: "dashboard",
      href: "/portal",
      icon: analyticsIcon,
      text: "Analytics",
      isActive: false,
    },
    {
      id: "content-and-services",
      href: "/portal",
      icon: contentIcon,
      text: "Content & Services",
      isActive: false,
    },
    {
      id: "feedback",
      href: "/portal",
      icon: feedbackIcon,
      text: "Feedback",
      isActive: false,
    },
    {
      id: "partner",
      href: "/portal",
      icon: partnershipIcon,
      text: "Partner Program",
      isActive: false,
    },
  ];

  function logout() {
    router.push("/");
    localStorage.removeItem("user");
  }

  useEffect(() => {
    function setActiveLink() {
      const currentRoute = window.location.pathname;
      let activeIsSet = false;
      navLinks.forEach((navLink) => {
        if (currentRoute.toLowerCase().includes(navLink.id.toLowerCase())) {
          navLink.isActive = true;
          activeIsSet = true;
        }
      });
      if (!activeIsSet) {
        navLinks[0].isActive = true;
      }
    }

    setActiveLink();
  }, []);
  return (
    <>
      <div className="w-full min-h-screen py-4 flex flex-col gap-12">
        <Image src={logo} alt="LearningPost Logo" height={50.0} />

        {/* NAV LINKS */}
        <ul className="m-0 p-0 flex flex-col gap-2">
          {navLinks.map((navLink) => {
            return (
              <li
                className={`w-full py-4 px-5 rounded-full ${
                  navLink.isActive ? "bg-gray-300" : "bg-transparent"
                } flex gap-4 items-center hover:bg-gray-200`}
                key={navLink.id}
              >
                <Image
                  src={navLink.icon}
                  alt={navLink.id}
                  width={24.0}
                  height={24.0}
                />
                <div className="flex-1 text-[15px]">
                  <Link
                    href={navLink.href}
                    className={
                      navLink.isActive ? "text-black" : "text-black/70"
                    }
                  >
                    {navLink.text}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>

        {/* LOGOUT BTN */}
        <div className="py-4 mt-auto border-t border-t-gray-400">
          <button
            onClick={() => logout()}
            className="w-full py-4 px-5 rounded-full flex gap-4 items-center bg-transparent hover:bg-gray-200 text-start"
          >
            <Image
              src={logoutIcon}
              alt="Logout btn"
              width={24.0}
              height={24.0}
            />
            <div className="flex-1 text-[15px]">
              <span className="text-black/70">Logout</span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
