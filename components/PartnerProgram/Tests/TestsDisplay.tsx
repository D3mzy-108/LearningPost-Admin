/* eslint-disable @next/next/no-img-element */
import { useToast } from "@/context/ToastContext";
import http from "@/utils/http";
import { DOMAIN, GET_PARTNER_TESTS_URL } from "@/utils/urls";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useDialog } from "@/context/DialogContext";
import TestForm from "./TestForm";
import Image from "next/image";
import rightArrowIcon from "@/assets/icons/right-arrow.svg";
import Link from "next/link";
import { Test } from "@/models/PartnerModels";

export default function TestsDisplay({ partnerCode }: { partnerCode: string }) {
  const { showToast } = useToast();
  const { showDialog } = useDialog();
  const [tests, setTests] = useState<Test[]>([]);
  const [searchVal, setSearchVal] = useState<string>("");

  const loadTests = useCallback(
    async (search_string: string) => {
      setSearchVal(search_string);
      const response = await http.get(
        GET_PARTNER_TESTS_URL(search_string, partnerCode)
      );
      if (response.success) {
        console.log(response.data);
        setTests(response.data.tests);
      } else {
        showToast(response.message, "error");
      }
    },
    [partnerCode, showToast]
  );

  function searchForQuest(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    loadTests(formData.get("s")?.toString() || "");
  }

  useEffect(() => {
    loadTests("");
  }, [loadTests]);

  return (
    <>
      <div className="w-full px-2 py-5">
        <form
          onSubmit={searchForQuest}
          method="get"
          className="flex w-full justify-end"
        >
          <label
            htmlFor="search_tests"
            className="w-fit pl-4 pr-2 border-b-2 border-b-black/60 grid place-items-center"
          >
            <span>&#128269;</span>
          </label>
          <input
            type="search"
            name="s"
            id="search_tests"
            className="w-full max-w-[150px] px-3 py-2 border-b-2 border-b-black/60 placeholder:text-black/80"
            placeholder="Search Tests..."
          />
          <button
            type="button"
            onClick={() => {
              showDialog(
                <>
                  <TestForm
                    instance={null}
                    isMutableOrganizationInstance={false}
                    organizationCode={partnerCode}
                  />
                </>
              );
            }}
            className="pl-3 pr-4 py-1 rounded-t-md rounded-b-none border-2 border-b-0 border-black/60 text-black bg-transparent flex items-center gap-3"
          >
            <span className="text-2xl">+</span>
            <span className="text-sm">New Test</span>
          </button>
          <div className="w-4 border-b-2 border-b-black/60"></div>
        </form>

        {/* TEST LIST */}
        <div className="w-full overflow-auto bg-gray-100 rounded-2xl p-2 mt-6">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="py-3">#</th>
                <th className="py-3" colSpan={4}>
                  Tests
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tests.map((test) => (
                <tr key={test.id}>
                  <td className="py-2">
                    <span className="text-sm text-black/60">#{test.id}</span>
                  </td>
                  <td className="py-2">
                    <div className="w-full flex items-center gap-3">
                      <Image
                        src={
                          test.cover.includes("http://") ||
                          test.cover.includes("https://")
                            ? test.cover
                            : DOMAIN + test.cover
                        }
                        alt=""
                        width={45}
                        height={45}
                        className="rounded-md"
                      />
                      <div className="text-black flex-1 font-normal line-clamp-2">
                        {test.title}
                      </div>
                    </div>
                  </td>
                  <td className="py-2">
                    <span className="text-sm text-black/60">
                      {test.attempts} attempts
                    </span>
                  </td>
                  <td className="py-2">
                    <span className="text-sm text-black/60">{test.status}</span>
                  </td>
                  <td className="py-2">
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          showDialog(
                            <>
                              <TestForm
                                instance={test}
                                isMutableOrganizationInstance={false}
                                organizationCode={test.organization}
                              />
                            </>
                          );
                        }}
                        className="w-fit bg-transparent border border-black/60 py-2 px-3 flex gap-2 items-center justify-center rounded-full truncate"
                      >
                        <span>&#9998;</span>
                      </button>
                      <Link
                        href={`/portal/partner-program/materials/${partnerCode}/cbt/questions/?title=${test.title}&testID=${test.id}`}
                        className="bg-white shadow p-0 w-[40px] aspect-square grid place-items-center text-blue-600 rounded-full text-xl"
                      >
                        <Image
                          src={rightArrowIcon}
                          alt="right-arrow"
                          width={22}
                          height={22}
                        />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
