// SelectField component

const SelectField = ({ label, options, sanitizedLabel, error, register, validationRules, onChange }) => (
  <div className="mb-3">
    <label className="form-label">{label}</label>
    <select
      className={`form-select ${error ? 'is-invalid' : ''}`}
      {...register(sanitizedLabel, validationRules)}
      onChange={onChange}
    >
      <option value="">Seleccione...</option>
      {options.map((option, idx) => (
        <option key={idx} value={option}>
          {option}
        </option>
      ))}
    </select>
    {error && <small className="text-danger">{error.message}</small>}
  </div>
);

export default SelectField;
