import Link from "next/link";

export default function About() {
  return (
    <main style={{ textAlign: "center", padding: "20px" }}>
      <h1>About Us</h1>
      <Link href="/">Go Home</Link>
    </main>
  );
}