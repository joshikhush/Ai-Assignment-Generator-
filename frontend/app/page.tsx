import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-48 h-48 bg-gray-200 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">🔍❌</span>
      </div>
      <h2 className="text-2xl font-bold mb-2">No assignments yet</h2>
      <p className="text-gray-500 text-center max-w-md mb-8">
        Create your first assignment to start collecting and grading student
        submissions. You can set up rubrics, define marking criteria, and let AI
        assist with grading.
      </p>
      <Link href="/create" className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition">
        + Create Your First Assignment
      </Link>
    </div>
  );
}
