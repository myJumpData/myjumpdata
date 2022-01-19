export default function Spinner({ wrapper }: { wrapper?: boolean }) {
  if (wrapper) {
    return (
      <div className="h-screen w-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 fixed z-50 top-0 bottom-0 left-0 right-0">
        <div className="border-[.75rem] border-gray-500/50 border-t-yellow-500 rounded-full animate-spin h-[40vh] w-[40vh]"></div>
      </div>
    );
  } else {
    return (
      <div className="border-[.75rem] border-gray-500/50 border-t-yellow-500 h-full aspect-square rounded-full animate-spin"></div>
    );
  }
}
