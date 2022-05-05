export default function AdminActionBar({
  text,
  actions,
}: {
  text: string;
  actions?: ({ icon: any; onClick: () => void } | null)[];
}) {
  return (
    <div className="flex h-12 items-center justify-between space-x-4 rounded-lg bg-gray-500/50 px-4 py-2">
      <span className="text-xl font-bold">{text}</span>
      <div className="flex space-x-4">
        {actions?.map((action, index) => {
          if (action) {
            return (
              <div
                key={index}
                className="opacity-50 transition hover:scale-125 hover:opacity-100"
                onClick={() => {
                  action.onClick();
                }}
              >
                <action.icon className="text-lg" />
              </div>
            );
          }
          return "";
        })}
      </div>
    </div>
  );
}
