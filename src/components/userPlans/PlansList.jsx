import React from "react";
import PlanCard from "./PlanCard";

export default function PlansList({ plans, config, activePlan, addToCart, handleBuy }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch justify-center">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          config={config}
          activePlan={activePlan}
          addToCart={addToCart}
          handleBuy={handleBuy}
        />
      ))}
    </div>
  );
}