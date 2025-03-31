"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function SurveyLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  // Block navigation using beforeunload event
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Only block navigation if on the artist selection page
      if (pathname === "/artist-selection") {
        // Standard way to show a confirmation dialog
        e.preventDefault();
        e.returnValue = "You must complete the artist selection to continue.";
        return e.returnValue;
      }
    };

    // Add the event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>

      <footer className="bg-gray-100 py-4 text-center">
        <p>Complete the survey to continue</p>
      </footer>
    </div>
  );
}
