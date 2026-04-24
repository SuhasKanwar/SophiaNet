type DottedPatternProps = {
  spacing?: number;
  dotSize?: number;
  opacity?: number;
};

export default function DottedPattern({
  spacing = 24,
  dotSize = 1.5,
  opacity = 0.2,
}: DottedPatternProps) {
  const color = `rgba(255, 255, 255, ${opacity})`;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        backgroundImage: `radial-gradient(${color} ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${spacing}px ${spacing}px`,
        backgroundPosition: "0 0",
      }}
    />
  );
}