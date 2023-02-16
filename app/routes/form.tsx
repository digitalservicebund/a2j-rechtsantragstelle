import { Outlet } from "@remix-run/react";

export default function FormRoot() {
  return (
    <main>
      <header>
        <h1>Antrag Root</h1>
      </header>
      <Outlet />
    </main>
  );
}
