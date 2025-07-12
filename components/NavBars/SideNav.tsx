"use client";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import analyticsIcon from "@/assets/icons/analytics.svg";
import contentIcon from "@/assets/icons/content.svg";
import feedbackIcon from "@/assets/icons/feedback.svg";
import partnershipIcon from "@/assets/icons/partnership.svg";
import logoutIcon from "@/assets/icons/logout.svg";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const NAV_LINKS = [
  {
    id: "dashboard",
    href: "/portal",
    icon: analyticsIcon,
    text: "Analytics",
  },
  {
    id: "content-and-services",
    href: "/portal/content-and-services",
    icon: contentIcon,
    text: "Content & Services",
  },
  {
    id: "feedback",
    href: "/portal/feedback",
    icon: feedbackIcon,
    text: "Feedback",
  },
  {
    id: "partner",
    href: "/portal/partner-program",
    icon: partnershipIcon,
    text: "Partner Program",
  },
];

export default function SideNav() {
  const router = useRouter();
  const pathname = usePathname();

  function logout() {
    router.push("/");
    localStorage.removeItem("user");
  }

  // Find the most specific active link by sorting matches by href length
  const activeLink = NAV_LINKS.filter((link) =>
    pathname.startsWith(link.href)
  ).sort((a, b) => b.href.length - a.href.length)[0];

  return (
    <>
      <div className="w-full min-height-screen py-4 flex flex-col gap-12">
        <Image
          src={logo}
          alt="LearningPost Logo"
          height={50.0}
          className=" max-sm:opacity-0"
        />

        {/* NAV LINKS */}
        <ul className="m-0 p-0 flex flex-col gap-2">
          {NAV_LINKS.map((navLink) => {
            const isActive = navLink.id === activeLink?.id;
            return (
              <li
                className={`w-full py-4 px-5 max-sm:px-2 rounded-full ${
                  isActive ? "bg-gray-300" : "bg-transparent"
                } hover:bg-gray-200`}
                key={navLink.id}
              >
                <Link
                  href={navLink.href}
                  className={`${
                    isActive ? "text-black" : "text-black/70"
                  } flex gap-4 items-center`}
                >
                  <Image
                    src={navLink.icon}
                    alt={navLink.id}
                    width={24.0}
                    height={24.0}
                    className="max-sm:scale-110"
                  />
                  <div className="flex-1 text-[15px] max-sm:hidden">
                    {navLink.text}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* LOGOUT BTN */}
        <div className="py-4 mt-auto border-t border-t-gray-400">
          <button
            onClick={() => logout()}
            className="w-full py-4 px-5 max-sm:px-2 rounded-full flex gap-4 items-center bg-transparent hover:bg-gray-200 text-start"
          >
            <Image
              src={logoutIcon}
              alt="Logout btn"
              width={24.0}
              height={24.0}
            />
            <div className="flex-1 text-[15px] max-sm:hidden">
              <span className="text-black/70">Logout</span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
