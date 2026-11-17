type DottedPatternProps = {
  className?: string;
  spacing?: number;
  dotSize?: number;
  opacity?: number;
};

export default function DottedPattern({
  className = "fixed inset-0 -z-10 pointer-events-none",
  spacing = 24,
  dotSize = 1.5,
  opacity = 0.2,
}: DottedPatternProps) {
  const color = `rgba(255, 255, 255, ${opacity})`;

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        backgroundImage: `radial-gradient(${color} ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${spacing}px ${spacing}px`,
        backgroundPosition: "0 0",
      }}
    />
  );
}