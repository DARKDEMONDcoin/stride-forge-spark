/**
 * شريط إجراءات موحّد أسفل كل مخرج للموظف:
 * 1) روابط سريعة للأداة المتخصصة المناسبة لكل موظف (تقويم، محرر تصميم، تقارير…).
 * 2) خيار ثابت للنسخ والتنزيل، وربط المنصة إن لم تكن مربوطة بعد.
 */
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, Check, Copy, Download, Globe, ImageIcon, LineChart, ListChecks, Palette, Send, Sparkles, Users } from "lucide-react";

import { ConnectNow } from "@/components/app/ConnectNow";
import { OutputPreview } from "@/components/app/OutputPreview";
import { appLabel } from "@/components/site/AppIcon";
import { cn } from "@/lib/utils";

/** تمرير المخرج لزميل مناسب لإكمال المهمة المركّبة داخل تخصصه. */
function teamFollowUps(employeeId: string): { id: string; label: string; prompt: string }[] {
  switch (employeeId) {
    case "sam":
      return [
        { id: "nour", label: "مرّر البحث لنور", prompt: "حوّل نتائج البحث التالية إلى خطة محتوى تنفيذية." },
        { id: "sonny", label: "حوّله لمنشورات مع سوني", prompt: "اكتب منشورات سوشيال من نتائج البحث التالية." },
      ];
    case "nour":
      return [
        { id: "sonny", label: "نفّذ المنشورات مع سوني", prompt: "اكتب منشورات جاهزة للنشر من الخطة التالية." },
        { id: "dana", label: "جهّز التصاميم مع دانة", prompt: "جهّز تصاميم مناسبة للخطة التالية بمقاسات المنصات." },
      ];
    case "sonny":
      return [
        { id: "dana", label: "صمّم له صورة مع دانة", prompt: "صمّم صورة مناسبة للمنشور التالي." },
      ];
    case "dana":
      return [
        { id: "sonny", label: "اكتب نص النشر مع سوني", prompt: "اكتب نص منشور مناسب للتصميم التالي." },
      ];
    case "eva":
      return [
        { id: "sam", label: "ابحث بالتفاصيل مع سام", prompt: "ابحث وعمّق المعلومات الواردة في التالي." },
      ];
    default:
      return [];
  }
}

type QuickLink = {
  to: string;
  label: string;
  icon: typeof CalendarDays;
  search?: Record<string, string>;
};

/** أول صورة داخل نص ماركداون — تُستخدم لفتح التصميم في محرر دانة وتنزيله. */
export function firstImageUrl(body: string): string | null {
  const md = body.match(/!\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/);
  if (md?.[1]) return md[1];
  const raw = body.match(/https?:\/\/\S+\.(?:png|jpe?g|webp|gif)(?:\?\S*)?/i);
  return raw?.[0] ?? null;
}

function linksFor(employeeId: string, imageUrl: string | null): QuickLink[] {
  const image = imageUrl ? { img: imageUrl } : undefined;
  switch (employeeId) {
    case "sonny":
      return [
        { to: "/app/calendar", label: "تقويم المحتوى", icon: CalendarDays },
        { to: "/app/queue", label: "طابور النشر", icon: Send },
      ];
    case "dana":
      return [
        {
          to: "/app/design-editor",
          label: imageUrl ? "افتح التصميم في المحرر" : "محرر التصميم",
          icon: Palette,
          ...(image ? { search: image } : {}),
        },
        { to: "/app/calendar", label: "أضِفه لتقويم المحتوى", icon: ImageIcon },
      ];
    case "adam":
      return [
        { to: "/app/reports", label: "تقرير السيو الكامل", icon: LineChart },
        { to: "/app/rankings", label: "تتبّع الترتيب", icon: LineChart },
      ];
    case "nour":
      return [
        { to: "/app/calendar", label: "خطة المحتوى", icon: CalendarDays },
        { to: "/app/rankings", label: "كلماتك المفتاحية", icon: LineChart },
      ];
    case "sam":
      return [
        { to: "/app/proposals", label: "المبادرات والعروض", icon: Sparkles },
        { to: "/app/approvals", label: "طابور الموافقات", icon: ListChecks },
      ];
    case "eva":
      return [
        { to: "/app/browser", label: "المتصفح المنفّذ", icon: Globe },
        { to: "/app/approvals", label: "طابور الموافقات", icon: ListChecks },
      ];
    default:
      return [{ to: "/app/approvals", label: "طابور الموافقات", icon: ListChecks }];
  }
}

export function OutputActions({
  employeeId,
  employeeName,
  body,
  workspaceId,
  missingProvider,
  className,
}: {
  employeeId: string;
  employeeName: string;
  body: string;
  workspaceId: string | undefined;
  /** منصة مطلوبة للتنفيذ الآلي وغير مربوطة بعد. */
  missingProvider?: string | null;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const imageUrl = firstImageUrl(body);
  const links = linksFor(employeeId, imageUrl);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const download = () => {
    const url = imageUrl;
    const a = document.createElement("a");
    if (url) {
      a.href = url;
      a.target = "_blank";
      a.rel = "noreferrer";
      a.download = `${employeeName}-تصميم`;
    } else {
      const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
      a.href = URL.createObjectURL(blob);
      a.download = `${employeeName}-مخرج.txt`;
    }
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const followUps = teamFollowUps(employeeId);

  return (
    <div className={cn("output-actions mt-3 flex flex-wrap items-center gap-1.5", className)}>
      {links.map((link) => (
        <Link
          key={`${link.to}-${link.label}`}
          to={link.to}
          {...(link.search ? { search: link.search as never } : {})}
          className="output-action-chip inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[0.72rem] font-bold transition-colors hover:bg-secondary"
        >
          <link.icon className="size-3.5 shrink-0" />
          {link.label}
        </Link>
      ))}

      <OutputPreview employeeId={employeeId} employeeName={employeeName} body={body} />

      <button
        type="button"
        onClick={() => void copy()}
        className="output-action-chip inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[0.72rem] font-bold transition-colors hover:bg-secondary"
      >
        {copied ? <Check className="size-3.5 text-jade" /> : <Copy className="size-3.5" />}
        {copied ? "تم النسخ" : "انسخ المخرج"}
      </button>

      <button
        type="button"
        onClick={download}
        className="output-action-chip inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[0.72rem] font-bold transition-colors hover:bg-secondary"
      >
        <Download className="size-3.5" />
        {imageUrl ? "نزّل التصميم" : "نزّل المخرج"}
      </button>

      {followUps.map((next) => (
        <Link
          key={next.id}
          to="/app/chat/$id"
          params={{ id: next.id }}
          search={{ prompt: `${next.prompt}\n\n---\n${body.slice(0, 1200)}` }}
          className="output-action-chip inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/8 px-3 py-1.5 text-[0.72rem] font-bold text-primary transition-colors hover:bg-primary/15"
        >
          <Users className="size-3.5 shrink-0" />
          {next.label}
        </Link>
      ))}

      {missingProvider ? (
        <span className="inline-flex items-center gap-2 rounded-full border border-sky/30 bg-sky/10 px-2 py-1">
          <span className="text-[0.7rem] font-bold text-ink-soft">
            {appLabel(missingProvider)} غير مربوط
          </span>
          <ConnectNow
            workspaceId={workspaceId}
            provider={missingProvider}
            size="sm"
            label="اربطه للتنفيذ الآلي"
          />
        </span>
      ) : null}
    </div>
  );
}
