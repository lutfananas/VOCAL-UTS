"use client";

// Komponen ornamen budaya Tulungagung / Jawa
// - Batik divider
// - Cultural welcome banner
// - Ornamental section header

import { cn } from "@/lib/utils";

// Batik divider - garis pembatas dengan motif emas
export function BatikDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-4 w-full bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2260%22%20height%3D%2216%22%20viewBox%3D%220%200%2060%2016%22%3E%3Cg%20fill%3D%22%23c9a227%22%3E%3Cpath%20d%3D%22M30%200%20L34%204%20L38%200%20L42%204%20L38%208%20L42%2012%20L38%2016%20L34%2012%20L30%2016%20L26%2012%20L22%2016%20L18%2012%20L22%208%20L18%204%20L22%200%20L26%204%20Z%22%2F%3E%3Ccircle%20cx%3D%2210%22%20cy%3D%228%22%20r%3D%223%22%20fill%3D%22%238b5a2b%22%2F%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%228%22%20r%3D%223%22%20fill%3D%22%238b5a2b%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] bg-repeat-x bg-center bg-[length:60px_16px] my-3",
        className
      )}
      aria-hidden
    />
  );
}

// Cultural hero banner dengan sogan background + batik pattern
export function CulturalHero({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <div className="batik-hero rounded-xl p-6 md:p-8 text-center relative overflow-hidden shadow-lg">
      {/* Decorative corner ornaments */}
      <div className="absolute top-3 left-3 text-emas text-2xl opacity-40" aria-hidden>
        ❋
      </div>
      <div className="absolute top-3 right-3 text-emas text-2xl opacity-40" aria-hidden>
        ❋
      </div>
      <div className="absolute bottom-3 left-3 text-emas text-2xl opacity-40" aria-hidden>
        ❋
      </div>
      <div className="absolute bottom-3 right-3 text-emas text-2xl opacity-40" aria-hidden>
        ❋
      </div>

      {badge && (
        <div className="inline-block px-3 py-1 bg-emas/20 border border-emas rounded-full text-emas-light text-xs font-semibold uppercase tracking-widest mb-3">
          {badge}
        </div>
      )}
      <h1 className="text-2xl md:text-4xl font-bold text-krem mb-2 tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm md:text-base text-krem/80 italic font-display">
          {subtitle}
        </p>
      )}
      <div className="mt-4 flex items-center justify-center gap-2">
        <span className="h-px w-12 bg-emas/60" />
        <span className="text-emas text-lg">❋</span>
        <span className="h-px w-12 bg-emas/60" />
      </div>
    </div>
  );
}

// Welcome banner dengan sambutan Jawa
export function SugengRawuhBanner() {
  return (
    <div className="text-center space-y-1 mb-2">
      <p className="font-display text-lg md:text-xl text-dongker-dark italic">
        Sugeng Rawuh
      </p>
      <p className="text-xs text-muted-foreground tracking-wider">
        Selamat Datang di Ujian Speaking CBT
      </p>
    </div>
  );
}

// Section header dengan ornamen
export function SectionHeader({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-emas" />
        {icon && <span className="text-emas">{icon}</span>}
        <span className="h-px w-8 bg-emas" />
      </div>
      <h2 className="text-xl md:text-2xl font-bold text-dongker-dark font-display">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-muted-foreground italic max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// Tulungagung cultural info card
export function TulungagungInfoCard() {
  return (
    <div className="rounded-lg border border-emas/40 bg-gradient-to-br from-krem-warm to-krem p-4 space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-emas">❋</span>
        <h4 className="text-sm font-bold text-dongker-dark font-display tracking-wide">
          Tetang Tulungagung
        </h4>
        <span className="text-emas">❋</span>
      </div>
      <ul className="text-xs text-muted-foreground space-y-1.5 leading-relaxed">
        <li>
          <span className="font-semibold text-dongker">Kerajinan Onyx</span> —
          Tulungagung terkenal sebagai pusat kerajinan batu onyx, dengan motif
          khas berwarna biru dongker dan krem seperi tema ujian ini.
        </li>
        <li>
          <span className="font-semibold text-dongker">Batik Tulungagung</span> —
          Memiliki motif khas seperti &ldquo;Sekar Jagad&rdquo; dan &ldquo;Kembang
          Wijaya&rdquo; dengan kombinasi biru dongker dan merah khas Jawa.
        </li>
        <li>
          <span className="font-semibold text-dongker">Pantai Popoh</span> —
          Salah satu pantai terkenal di pesisir selatan, dengan ombak tenang
          khas Samudra Indonesia.
        </li>
        <li>
          <span className="font-semibold text-dongker">Kuliner Gepeng</span> —
          Tape ketan gepeng dan kue tradisional khas Tulungagung.
        </li>
      </ul>
    </div>
  );
}

// Decorative footer dengan batik motif
export function BatikFooter() {
  return (
    <footer className="mt-8">
      <BatikDivider />
      <div className="text-center py-4 space-y-1">
        <p className="text-xs text-muted-foreground font-display italic">
          &ldquo;Budaya kui dudu wates, nanging dadi identitas&rdquo;
        </p>
        <p className="text-[10px] text-muted-foreground">
          &ldquo;Budaya bukan batas, melainkan identitas&rdquo; — Filosofi
          Javanese
        </p>
        <p className="text-[10px] text-dongker mt-2">
          &copy; {new Date().getFullYear()} FISIP &middot; Sistem CBT Speaking
          Examination &middot; Tema Budaya Tulungagung
        </p>
      </div>
    </footer>
  );
}
