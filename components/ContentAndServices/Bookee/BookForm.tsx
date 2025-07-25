import { useToast } from "@/context/ToastContext";
import { useDialog } from "@/context/DialogContext";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import http from "@/utils/http";
import { LOAD_EXT_FORM_DATA_URL, SAVE_BOOK_INSTANCE_URL } from "@/utils/urls";
import { Book } from "@/models/BookeeModels";

export default function BookForm({
  instance,
  isMutableOrganizationInstance,
  organizationCode,
}: {
  instance: Book | null;
  isMutableOrganizationInstance: boolean;
  organizationCode: string | null;
}) {
  const { showToast } = useToast();
  const { hideDialog } = useDialog();
  const router = useRouter();
  const inputFields = [
    {
      label: "Title",
      sub: "",
      name: "title",
      type: "text",
      value: instance?.title ?? "",
    },
    {
      label: "Author",
      sub: "",
      name: "author",
      type: "text",
      value: instance?.author ?? "",
    },
  ];
  const textAreaFields = [
    {
      label: "About Book",
      sub: "",
      name: "about",
      value: `${instance?.about ?? ""}`,
    },
    {
      label: "About Author",
      sub: "",
      name: "about_author",
      value: `${instance?.about_author ?? ""}`,
    },
  ];
  const [organizations, setOrganizations] = useState([]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const response = await http.multipartPost(
      SAVE_BOOK_INSTANCE_URL(),
      formData
    );
    if (response.success) {
      showToast(response.message, "success");
      router.refresh();
      hideDialog();
    } else {
      showToast(response.message, "error");
    }
  };

  useEffect(() => {
    async function loadExtFormData() {
      const response = await http.get(LOAD_EXT_FORM_DATA_URL());
      if (response.success) {
        setOrganizations(response.data.organizations);
      }
    }

    loadExtFormData();
  }, []);

  if (isMutableOrganizationInstance && organizations.length === 0) {
    return <div className="grid place-items-center">Loading...</div>;
  }

  return (
    <div className="p-0 sm:px-6 sm:py-3 flex flex-col md:flex-row">
      <div className="w-full md:w-2/6 max-md:border-b-2 md:border-r-2"></div>
      <div className="w-full md:w-4/6">
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="flex flex-col gap-6 p-6 bg-white rounded-lg w-full mx-auto"
        >
          {instance !== null && (
            <input type="hidden" name="id" value={instance.id} />
          )}
          <h2 className="text-2xl font-bold text-gray-800">
            {instance !== null
              ? `Edit "${instance.title}" Book`
              : "Create New Book"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cover Image URL */}
            <div className="md:col-span-2">
              <label
                htmlFor="cover"
                className="block text-sm font-medium text-gray-700"
              >
                Cover Image URL
              </label>
              <span className="text-xs text-blue-600 underline">
                {instance?.cover ?? ""}
              </span>
              <input
                type="file"
                name="cover"
                id="cover"
                required={instance === null}
                className="mt-1 block w-full rounded-md border-gray-300 bg-[rgba(0,0,0,.05)] p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                accept="image/*"
              />
            </div>

            {/* Title, Author */}
            {inputFields.map((field) => (
              <div className="flex flex-col" key={field.name}>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  {field.label}
                </label>
                <small className="text-xs text-black/40">{field.sub}</small>
                <input
                  type={field.type}
                  name={field.name}
                  id={field.name}
                  defaultValue={field.value}
                  required
                  className="mt-2 block w-full rounded-md border-gray-300 bg-[rgba(0,0,0,.05)] p-3 shadow-sm focus:outline-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            ))}

            {/* Organization */}
            {organizationCode !== null && organizationCode.length > 0 ? (
              <div className="flex flex-col">
                <label
                  htmlFor="organization_code"
                  className="block text-sm font-medium text-gray-700"
                >
                  Organization/Partner
                </label>

                {isMutableOrganizationInstance ? (
                  <select
                    name="organization_code"
                    id="organization_code"
                    required
                    defaultValue={instance?.organization ?? ""}
                    className={`mt-2 block w-full rounded-md border-gray-300 bg-[rgba(0,0,0,.05)] p-3 shadow-sm focus:outline-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                  >
                    <option value="">Select Partner</option>
                    {organizations.map((organization) => (
                      <option
                        value={organization["code"]}
                        key={organization["code"]}
                      >
                        {organization["name"]}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name="organization_code"
                    id="organization_code"
                    defaultValue={organizationCode}
                    required
                    readOnly={true}
                    className="mt-2 block w-full rounded-md border-gray-300 bg-[rgba(0,0,0,.05)] p-3 shadow-sm focus:outline-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                )}
              </div>
            ) : null}

            {/* About Book && About Author */}
            {textAreaFields.map((field) => (
              <div className="flex flex-col" key={field.name}>
                <label
                  htmlFor="about"
                  className="block text-sm font-medium text-gray-700"
                >
                  {field.label}
                </label>
                <textarea
                  name={field.name}
                  id={field.name}
                  rows={3}
                  required
                  defaultValue={field.value}
                  className="mt-2 block w-full rounded-md border-gray-300 bg-[rgba(0,0,0,.05)] p-3 shadow-sm focus:outline-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {instance !== null ? "Update Book" : "Create Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
