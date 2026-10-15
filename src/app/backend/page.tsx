import { redirect } from "next/navigation";

export default function BackendRedirectPage() {
  redirect("/admin");
}
