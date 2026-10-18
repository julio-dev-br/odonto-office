export function TableSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden animate-pulse">
      {/* Esqueleto da Toolbar Superior */}
      <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-md w-32" />
        <div className="h-9 bg-gray-200 dark:bg-slate-700 rounded-xl w-full sm:w-64" />
      </div>

      {/* Esqueleto das Linhas da Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/20">
              {[...Array(6)].map((_, i) => (
                <th key={i} className="py-4 px-6">
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-md w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {/* Renderiza 3 linhas falsas de esqueleto piscando */}
            {[...Array(3)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                <td className="py-4 px-6"><div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-md w-8" /></td>
                <td className="py-4 px-6"><div className="h-3.5 bg-gray-200 dark:bg-slate-700 rounded-md w-36 font-bold" /></td>
                <td className="py-4 px-6"><div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-md w-24" /></td>
                <td className="py-4 px-6"><div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-md w-24" /></td>
                <td className="py-4 px-6"><div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-md w-20" /></td>
                <td className="py-4 px-6 flex justify-end"><div className="h-6 bg-gray-200 dark:bg-slate-700 rounded-md w-24" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
