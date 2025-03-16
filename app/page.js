import Link from "next/link";

export default function Home() {
  return (
    <main style={{ textAlign: "center", padding: "20px" }}>
      <h1>Welcome to Next.js</h1>
      <nav>
        <Link href="/dashboard">Dashboard</Link> |
        <Link href="/about">About</Link> |<Link href="/contacts">Contacts</Link>
      </nav>
    </main>
  );
}
