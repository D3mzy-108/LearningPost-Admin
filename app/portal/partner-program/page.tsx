/* eslint-disable @next/next/no-img-element */
"use client";
import { useToast } from "@/context/ToastContext";
import http from "@/utils/http";
import { DOMAIN, GET_PARTNERS_URL } from "@/utils/urls";
import Link from "next/link";
import { useEffect, useState } from "react";
import rightArrowIcon from "@/assets/icons/right-arrow.svg";
import Image from "next/image";
import { Partner } from "@/models/PartnerModels";

export default function PartnerProgram() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    async function loadPartners() {
      const response = await http.get(GET_PARTNERS_URL());
      if (!response.success) {
        showToast(response.message, "error");
        return;
      }
      setPartners(response.data.partners);
      return;
    }

    loadPartners();
  }, [showToast]);

  return (
    <>
      <div className="w-full space-y-6">
        {/* <div className="w-full max-w-lg overflow-auto rounded-xl bg-gray-100 p-4">
          <form method="post" className="w-full">
            <legend className="font-bold text-black/80">Add Partner</legend>
          </form>
        </div> */}

        <div className="w-full overflow-auto rounded-xl bg-gray-100 p-2 pb-0">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th>Partner</th>
                <th>Code</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner) => {
                return (
                  <tr key={partner.id}>
                    <td>
                      <div className="w-full flex gap-3 items-center">
                        <img
                          src={
                            partner.logo.includes("http://") ||
                            partner.logo.includes("https://")
                              ? partner.logo
                              : DOMAIN + partner.logo
                          }
                          alt=""
                          className="w-[50px] aspect-square rounded-md"
                        />
                        <div className="flex-1 font-normal line-clamp-2 text-black">
                          {partner.name}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="w-full flex text-black/60 italic truncate text-sm">
                        #{partner.code}
                      </div>
                    </td>
                    <td>
                      <Link
                        href={`/portal/partner-program/materials/${partner.code}`}
                        className="bg-white shadow p-0 w-[40px] aspect-square grid place-items-center text-blue-600 rounded-full text-xl"
                      >
                        <Image
                          src={rightArrowIcon}
                          alt="right-arrow"
                          width={22}
                          height={22}
                        />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
