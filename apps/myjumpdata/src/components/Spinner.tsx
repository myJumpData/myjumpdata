export default function Spinner({ wrapper }: { wrapper?: boolean }) {
  if (wrapper) {
    return (
      <div className="fixed top-0 bottom-0 left-0 right-0 z-50 flex h-screen w-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="h-[40vh] w-[40vh] animate-spin rounded-full border-[.75rem] border-gray-500/50 border-t-yellow-500"></div>
      </div>
    );
  } else {
    return (
      <div className="aspect-square h-full animate-spin rounded-full border-[.75rem] border-gray-500/50 border-t-yellow-500"></div>
    );
  }
}
