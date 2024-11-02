// PricingCarousel.jsx
import React, { useState } from "react";

type PricingPlan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
};

type PricingCardProps = {
  plan: PricingPlan;
};

const PricingCard: React.FC<PricingCardProps> = ({ plan }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className={`relative w-80 h-64 cursor-pointer transition-transform transform ${
        flipped ? "rotate-y-180" : ""
      } ${plan.recommended ? "border-2 border-primary shadow-lg bg-base-200" : "bg-base-200"} rounded-lg`}
    >
      {/* Recommended Badge */}
      {plan.recommended && (
        <span className="absolute top-0 right-0 bg-primary text-white px-3 py-1 rounded-bl-lg text-sm font-bold">
          Recommended
        </span>
      )}

      {/* Card Front */}
      <div
        className={`absolute inset-0 text-center flex flex-col items-center justify-center rounded-lg p-6 ${
          flipped ? "hidden" : "block"
        }`}
      >
        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
        <p className="text-xl font-semibold text-primary mb-4">{plan.price}</p>
        <p className="text-gray-500">{plan.description}</p>
      </div>

      {/* Card Back */}
      <div
        className={`absolute inset-0 bg-primary text-white flex flex-col items-center justify-center rounded-lg shadow-lg p-6 ${
          flipped ? "block" : "hidden"
        }`}
      >
        <h3 className="text-2xl font-bold mb-4">{plan.name} Features</h3>
        <ul className="text-left">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center mb-2">
              <span className="mr-2 text-green-300">✔️</span> {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    price: "₹0",
    description: "Basic features with limited pigeons.",
    features: ["Basic Pigeon", "Limited Transfers", "Ad-Supported"],
  },
  {
    name: "Pro",
    price: "₹299/month",
    description: "Advanced features with premium pigeons.",
    features: ["Premium Pigeon", "Unlimited Transfers", "No Ads"],
    recommended: true,
  },
  {
    name: "Enterprise",
    price: "Custom Pricing",
    description: "Bulk pigeon services for businesses.",
    features: ["Dedicated Pigeons", "Priority Support", "Custom Features"],
  },
];

const PricingCards: React.FC = () => (
  <section className="w-full py-12 bg-base-200 text-center">
    <h2 className="text-3xl font-bold mb-8">Pricing Plans</h2>
    <div className="flex flex-wrap justify-center gap-8">
      {pricingPlans.map((plan, index) => (
        <PricingCard key={index} plan={plan} />
      ))}
    </div>
  </section>
);

export default PricingCards;
