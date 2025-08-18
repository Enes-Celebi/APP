import { Link } from "react-router-dom";

export function LoginPrompt({
  onClose,
  inline = false,
  message = "You need an account to continue.",
}: {
  onClose?: () => void;
  inline?: boolean;        
  message?: string;
}) {
  const Card = (
    <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-100">
      <div className="text-lg font-semibold text-gray-900 mb-1">Sign in required</div>
      <div className="text-sm text-gray-600 mb-4">{message}</div>
      <div className="flex gap-2">
        <Link
          to="/login"
          className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-white hover:opacity-90"
        >
          Log in
        </Link>
        <Link
          to="/signup"
          className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          Sign up
        </Link>
        {onClose && (
          <button
            className="ml-auto rounded-xl px-3 py-2 text-gray-500 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );

  if (inline) return Card;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      {Card}
    </div>
  );
}
