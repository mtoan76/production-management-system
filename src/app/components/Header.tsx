import { RefreshCw } from "lucide-react";

type HeaderProps = {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  loading?: boolean;
  avatar?: string;
};

export default function Header({ title, subtitle, onRefresh, loading, avatar = "N" }: HeaderProps) {
  return (
    <header className="rounded-xl overflow-hidden shadow-sm mb-4">
      <div className="px-4 md:px-6 py-3 md:py-4 flex justify-between items-center" style={{ background: "linear-gradient(135deg, #0F2744 0%, #1a4980 50%, #1e3a5f 100%)" }}>
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-lg md:text-2xl font-bold uppercase tracking-wide text-white">{title}</h1>
            {subtitle && <p className="text-xs text-blue-200/70 mt-0.5 font-medium">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {onRefresh && (
            <button onClick={onRefresh} disabled={loading}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50"
              title="Làm mới">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          )}
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-white font-bold text-sm md:text-base">
            {avatar}
          </div>
        </div>
      </div>
    </header>
  );
}
