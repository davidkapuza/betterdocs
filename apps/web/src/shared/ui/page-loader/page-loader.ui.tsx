import { Loader2 } from "lucide-react";

export function PageLoader() {
  return (
    <div className="relative flex flex-col justify-center w-full p-6 text-center min-h-svh bg-background md:p-10">
      <Loader2 className="mx-auto animate-spin" />
    </div>
  );
}
