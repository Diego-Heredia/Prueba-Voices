// TextInput component

const TextInput = ({ label, type, sanitizedLabel, error, register, validationRules }) => (
  <div className="mb-3">
    <label className="form-label">{label}</label>
    <input
      className={`form-control ${error ? 'is-invalid' : ''}`}
      type={type}
      {...register(sanitizedLabel, validationRules)}
    />
    {error && <small className="text-danger">{error.message}</small>}
  </div>
);

export default TextInput;
