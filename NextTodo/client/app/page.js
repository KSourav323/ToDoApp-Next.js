import Link from "next/link";

export default function Home() {
  
  return (
    <main >
      <Link href="./login">Login</Link>
      <br/>
      <Link href="./signup">Register</Link>
    </main>
  );
}
