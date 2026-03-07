export default function Spinner({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center w-full h-full">
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