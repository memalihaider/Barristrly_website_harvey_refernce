import { redirect } from "next/navigation";

/** Product landings retired — Barristrly is a service company. */
export default function ProductSlugRedirect() {
  redirect("/services");
}
