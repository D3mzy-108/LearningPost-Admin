import { useDialog } from "@/context/DialogContext";
import { useToast } from "@/context/ToastContext";
import { SubscriptionPlan } from "@/models/SubscriptionModels";
import http from "@/utils/http";
import { SAVE_SUBSCRIPTION_INSTANCE_URL } from "@/utils/urls";
import { useRouter } from "next/navigation";

export default function SubscriptionPlanForm({
  plan,
  currenciesList,
}: {
  plan: SubscriptionPlan | null;
  currenciesList: string[][];
}) {
  const { showToast } = useToast();
  const { hideDialog } = useDialog();
  const router = useRouter();

  async function handleSubmitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const response = await http.multipartPost(
      SAVE_SUBSCRIPTION_INSTANCE_URL,
      formData
    );
    if (!response.success) {
      showToast(response.message, "error");
      return;
    }
    showToast(response.message, "success");
    hideDialog();
    router.refresh();
    return;
  }

  return (
    <>
      <form
        onSubmit={handleSubmitForm}
        method="POST"
        className="w-full max-w-sm"
      >
        {plan == null ? null : (
          <input type="hidden" name="id" value={plan.id} />
        )}
        <legend className="text-xl font-bold text-black/60">
          {plan ? `Edit ${plan.plan}` : "Create Subscription Plan"}
        </legend>
        <div className="w-full grid grid-cols-1 gap-6 mt-6 px-3">
          <div className="w-full flex gap-3 items-center">
            <div className="w-full flex-1">
              <label htmlFor="plan">Plan:</label>
            </div>
            <input
              type="text"
              name="plan"
              id="plan"
              className="flex-1 p-3 bg-black/10 rounded-lg border-b-2 border-b-black/30"
              defaultValue={plan?.plan}
              required
            />
          </div>

          <div className="w-full flex gap-3 items-center">
            <div className="w-full flex-1">
              <label htmlFor="duration">Duration:</label>
            </div>
            <input
              type="number"
              name="duration"
              id="duration"
              className="flex-1 p-3 bg-black/10 rounded-lg border-b-2 border-b-black/30"
              defaultValue={plan?.duration}
              required
            />
          </div>

          <div className="w-full flex gap-3 items-center">
            <div className="w-full flex-1">
              <label htmlFor="">Currency:</label>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-4">
                {currenciesList.map((currency) => {
                  return (
                    <div
                      className="w-fit flex gap-1 items-center"
                      key={currency[0]}
                    >
                      <input
                        type="radio"
                        name="currency"
                        id={currency[0]}
                        required
                        value={currency[0]}
                        defaultChecked={currency[0] == plan?.currency}
                      />
                      <label htmlFor={currency[0]} className="text-sm">
                        {currency[1]}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="w-full flex gap-3 items-center">
            <div className="w-full flex-1">
              <label htmlFor="price">Price:</label>
            </div>
            <input
              type="number"
              name="price"
              id="price"
              className="flex-1 p-3 bg-black/10 rounded-lg border-b-2 border-b-black/30"
              defaultValue={plan?.price}
              required
            />
          </div>

          <div className="h-px bg-black/40 my-3" />

          <button
            type="submit"
            className="rounded-lg shadow text-white w-[200px] mx-auto"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
