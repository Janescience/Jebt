const Table = ({ headers, data, actions }) => (
  <div className="overflow-x-auto ">
      <table className="mt-2 rounded text-xs shadow border-collapse border-2 border-slate-200 bg-white w-full">
      <thead>
        <tr className="">
          {headers.map((header) => (
            <th key={header} className="p-2">
              {header.toUpperCase()}
            </th>
          ))}
          {actions && <th >ACTIONS</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className={(row.debt?.currentPeriod == row.debt?.allPeriod && row.debt?.allPeriod > 1 ? 'bg-lime-400 font-bold  underline ':'')+' border border-gray-300'}>
            {headers.map((header, colIndex) => (
              <td key={colIndex} className="p-1 text-center">
                {row[header]}
              </td>
            ))}
            {actions && (
              <td className="p-1 flex justify-center">
                {actions.map(({ label, onClick, className ,icon: Icon}, actionIndex) => (
                  <button key={actionIndex} onClick={() => onClick(row.debt)} className={className}>
                    {label != '' ? label : <Icon size={12}/>}
                  </button>
                ))}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
    
  );
  
  export default Table;
  