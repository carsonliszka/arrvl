export function HoverText({
  text,
  className = '',
}: {
  text: string
  className?: string
}) {
  return (
    <span
      className={`relative overflow-hidden inline-flex flex-col h-[1.2em] ${className}`}
    >
      <span className="block transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
        {text}
      </span>
      <span
        className="block transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full"
        aria-hidden="true"
      >
        {text}
      </span>
    </span>
  )
}
