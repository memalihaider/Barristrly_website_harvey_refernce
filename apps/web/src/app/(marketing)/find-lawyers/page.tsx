import { redirect } from "next/navigation";

export default function FindLawyersRedirect() {
  redirect("/services/lawyer-matching");
}
