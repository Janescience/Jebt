const Input = ({ label, type, name, value, onChange, required = false, readOnly = false, options }) => (
    <div>
      <label className="block text-gray-700 mb-2">{label}</label>
      {type === 'select' ? (
        <select name={name} value={value} onChange={onChange} className="w-full p-2 border rounded" required={required}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-2 border rounded"
          required={required}
          readOnly={readOnly}
        />
      )}
    </div>
  );
  
  export default Input;
  