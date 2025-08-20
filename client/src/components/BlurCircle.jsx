const BlurCircle = ({
  top = null,
  left = null,
  right = null,
  bottom = null,
}) => {
  // Clamp positions so the circle always stays inside the viewport
  const safePosition = (pos, axisSize) => {
    if (typeof pos !== "number") return pos; // 'auto' or undefined
    return Math.max(0, Math.min(pos, axisSize)); // keep between 0 and viewport edge
  };

  const viewportW = typeof window !== "undefined" ? window.innerWidth : 0;
  const viewportH = typeof window !== "undefined" ? window.innerHeight : 0;

  return (
    <div
      className="
        absolute -z-50 
        h-58 w-58 aspect-square rounded-full 
        bg-[var(--color-primary-dull)] blur-3xl 
        max-md:h-40 max-md:w-40
        pointer-events-none
      "
      style={{
        top: safePosition(top, viewportH),
        left: safePosition(left, viewportW),
        right: safePosition(right, viewportW),
        bottom: safePosition(bottom, viewportH),
      }}
    />
  );
};

export default BlurCircle;
