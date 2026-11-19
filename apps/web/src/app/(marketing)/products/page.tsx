import { redirect } from "next/navigation";

/** Product stack retired — Barristrly is a service company. */
export default function ProductsIndexRedirect() {
  redirect("/services");
}
