"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="mt-4 bg-red-500 text-white p-2 rounded"
    >
      Logout
    </button>
  );
}