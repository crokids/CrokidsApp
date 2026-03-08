export default function Spinner({
  size = 40,
  fullscreen = false,
}: {
  size?: number;
  fullscreen?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center w-full ${
        fullscreen ? "h-screen" : "h-full"
      }`}
    >
      <div
        className="animate-spin rounded-full border-4 border-gray-300 border-t-black"
        style={{
          width: size,
          height: size,
        }}
      />
    </div>
  );
}