import Spinner from "./spinner";

export default function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <Spinner size={48} />
    </div>
  );
}