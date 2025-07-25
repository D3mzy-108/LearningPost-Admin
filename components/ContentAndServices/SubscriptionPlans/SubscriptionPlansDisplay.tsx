"use client";
import { useDialog } from "@/context/DialogContext";
import { useToast } from "@/context/ToastContext";
import { SubscriptionPlan } from "@/models/SubscriptionModels";
import http from "@/utils/http";
import { GET_SUBSCRIPTIONS_URL } from "@/utils/urls";
import { useEffect, useState } from "react";
import SubscriptionPlanForm from "./SubscriptionPlanForm";

export default function SubscriptionPlansDisplay() {
  const { showToast } = useToast();
  const { showDialog } = useDialog();
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);
  const [currencies, setCurrencies] = useState<string[][]>([]);

  useEffect(() => {
    async function loadSubscriptionPlans() {
      const response = await http.get(GET_SUBSCRIPTIONS_URL);

      if (!response.success) {
        showToast(response.message, "error");
        return;
      }
      setSubscriptionPlans(response.data.plans);
      setCurrencies(response.data.currencies);
      return;
    }

    loadSubscriptionPlans();
  }, [showToast]);

  return (
    <>
      <div className="w-full p-6 flex flex-col gap-6">
        <button
          type="button"
          onClick={() => {
            showDialog(
              <SubscriptionPlanForm plan={null} currenciesList={currencies} />
            );
          }}
          className="flex items-center py-2 px-4 ml-auto rounded-lg bg-gray-200"
        >
          <span className="text-2xl">+</span>
          <div className="w-full flex-1 ml-2">Create Plan</div>
        </button>

        <div className="w-full overflow-auto rounded-xl bg-gray-100 p-2 pb-0">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Price</th>
                <th>Currency</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptionPlans.length == 0 ? (
                <tr>
                  <td className="text-center" colSpan={4}>
                    No subscription plans created.
                  </td>
                </tr>
              ) : (
                subscriptionPlans.map((plan) => {
                  return (
                    <tr key={plan.id}>
                      <td>{plan.plan}</td>
                      <td>{plan.price}</td>
                      <td>{plan.currency}</td>
                      <td>{plan.duration} days</td>
                      <td>
                        <button
                          onClick={() => {
                            showDialog(
                              <SubscriptionPlanForm
                                plan={plan}
                                currenciesList={currencies}
                              />
                            );
                          }}
                          className="px-3 py-1 text-xs text-black/80 bg-black/10 rounded-full"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
