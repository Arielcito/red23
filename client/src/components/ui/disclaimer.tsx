import Link from "next/link"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface DisclaimerProps {
  className?: string
  text?: string
  showLink?: boolean
}

export function Disclaimer({
  className,
  text = "Red23 se desliga de toda responsabilidad legal relacionada con el uso de la plataforma por parte de casinos no regulados o cualquier actividad ilegal.",
  showLink = true
}: DisclaimerProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 p-3 bg-muted/50 border rounded-md",
        "text-xs text-muted-foreground",
        className
      )}
    >
      <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="leading-relaxed">
          {text}
          {showLink && (
            <>
              {" "}
              Ver{" "}
              <Link
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Términos de Uso
              </Link>
              .
            </>
          )}
        </p>
      </div>
    </div>
  )
}
