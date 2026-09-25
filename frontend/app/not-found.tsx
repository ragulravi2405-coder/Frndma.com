import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 mb-4 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
        <Heart className="w-8 h-8 fill-current" />
      </div>
      <h2 className="text-4xl font-extrabold text-white font-heading mb-2">404</h2>
      <p className="text-zinc-400 text-sm max-w-sm mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/discover"
        className="py-3 px-6 rounded-2xl bg-gradient-to-r from-primary to-rose-600 text-white text-xs font-bold shadow-glow-sm"
      >
        Back to Discover
      </Link>
    </div>
  );
}
