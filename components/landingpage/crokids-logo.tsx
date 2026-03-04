import Image from "next/image"

export function CrokidsLogo({ className = "", size = "default" }: { className?: string; size?: "default" | "large" }) {
  const dimensions = size === "large" ? { width: 120, height: 120 } : { width: 44, height: 44 }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative overflow-hidden rounded-full border-2 border-primary/20 bg-primary/5">
        <Image
          src="/images/crokids-logo.png"
          alt="Crokids mascote"
          width={dimensions.width}
          height={dimensions.height}
          className="object-cover"
          priority
        />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-sans text-xl font-extrabold tracking-tight text-foreground">
          {"Cro"}
          <span className="text-primary">{"kids"}</span>
        </span>
        {size === "large" && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Salgadinhos de Trigo
          </span>
        )}
      </div>
    </div>
  )
}
