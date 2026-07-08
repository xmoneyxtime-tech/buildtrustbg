type TableColumn<T> = {
  key: keyof T;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
};

type AdminTableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  actions?: {
    label: string;
    onClick: (row: T) => void;
    variant?: "primary" | "secondary" | "danger";
  }[];
};

export function AdminTable<T extends { id: string }>({
  columns,
  data,
  actions,
}: AdminTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-[20px] border border-slate-200/80 shadow-[0_12px_32px_-16px_rgba(15,76,129,0.12)]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200/80 bg-[#F8FAFC]">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="px-6 py-4 text-left text-sm font-semibold text-slate-900"
              >
                {column.label}
              </th>
            ))}
            {actions && <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Действия</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              className="border-b border-slate-200/40 transition hover:bg-[#F8FAFC]"
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className="px-6 py-4 text-sm text-slate-700"
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : String(row[column.key])}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {actions.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => action.onClick(row)}
                        className={`rounded-[8px] px-3 py-1.5 text-xs font-semibold transition ${
                          action.variant === "danger"
                            ? "border border-red-200 bg-white text-red-600 hover:bg-red-50"
                            : action.variant === "primary"
                              ? "bg-[#0F4C81] text-white hover:bg-[#0B3D67]"
                              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
