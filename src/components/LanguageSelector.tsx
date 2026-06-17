import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Search, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

const LanguageSelector = () => {
  const { lang, setLang, languages, translating } = useI18n();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentLang = languages.find((l) => l.code === lang);
  const filtered = languages.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 backdrop-blur-sm px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200"
      >

        {translating ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        ) : (
          <Globe className="h-4 w-4 text-primary" />
        )}
        <span className="hidden sm:inline">{currentLang?.name || lang.toUpperCase()}</span>
        <span className="sm:hidden">{lang.toUpperCase()}</span>
        <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-elevated z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-border/50 sticky top-0 bg-card/50 backdrop-blur-sm z-10">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search language..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-border/60 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-muted-foreground/20">
            {filtered.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-6 italic">No languages found</p>
            )}
            <div className="grid gap-1">
              {filtered.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    l.code === lang
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "text-foreground hover:bg-accent/80 hover:translate-x-0.5"
                  }`}
                >
                  <span className="truncate">{l.name}</span>
                  <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                    l.code === lang ? "bg-white/20" : "bg-muted text-muted-foreground"
                  }`}>
                    {l.code}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LanguageSelector;
