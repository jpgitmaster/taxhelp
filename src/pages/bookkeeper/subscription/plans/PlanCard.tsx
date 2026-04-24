import Link from "next/link";

const PlanCard = ({ plan }: any) => {
  return (
    <div
      className={`relative border rounded-xl p-6 flex flex-col justify-between
        ${plan.current ? 'border-black shadow-md scale-[1.02]' : 'bg-white'}
      `}
    >
      {/* Current badge */}
      {plan.current && (
        <div className="absolute top-0 right-0 bg-black text-white text-xs px-3 py-1 rounded-bl-lg">
          Current Plan
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">{plan.name}</h3>
          <p className="text-gray-500 text-sm">
            ₱{plan.price} / month
          </p>
        </div>

        <ul className="space-y-2 text-sm text-gray-600">
          {plan.features.map((f: string, i: number) => (
            <li key={i}>• {f}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        {plan.current ? (
          <button
            disabled
            className="w-full bg-gray-200 text-gray-500 py-2 rounded-lg text-sm cursor-not-allowed"
          >
            Current Plan
          </button>
        ) : (
          <Link href='/bookkeeper/subscription/plans/gcash_payment' className="w-full inline-block text-center bg-black text-white py-2 rounded-lg text-sm hover:opacity-90">
            Choose Plan
          </Link>
        )}
      </div>
    </div>
  )
}
export default PlanCard;