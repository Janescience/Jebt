const Table = ({ headers, data, actions }) => (
    <table className="w-full mt-2 border-collapse border border-gray-200">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header} className="border border-gray-200 p-2">
              {header}
            </th>
          ))}
          {actions && <th className="border border-gray-200 p-2">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {headers.map((header, colIndex) => (
              <td key={colIndex} className="border border-gray-200 p-2">
                {row[header]}
              </td>
            ))}
            {actions && (
              <td className="border border-gray-200 p-2">
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
  );
  
  export default Table;
  