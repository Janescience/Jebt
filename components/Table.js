const Table = ({ headers, data, actions }) => (
  <div class="overflow-x-auto ">
      <table className="mt-2 border-collapse border border-slate-500 bg-white w-full">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header} >
              {header}
            </th>
          ))}
          {actions && <th >Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} >
            {headers.map((header, colIndex) => (
              <td key={colIndex} className="p-1">
                {row[header]}
              </td>
            ))}
            {actions && (
              <td className="p-1">
                {actions.map(({ label, onClick, className }, actionIndex) => (
                  <button key={actionIndex} onClick={() => onClick(row)} className={className}>
                    {label}
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
  