import { useState } from "react";

function FormField({
  label,
  name,
  type,
  value,
  onChange,
  required,
}) {
  return (
    <div>
      <label htmlFor={name}></label>
      <input
        id={name}
        name={name}
        placeholder={label + (required ? " *" : "")}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

export default function AuthForm({
  fields,
  values,
  onChange,
  onSubmit,
  submitLabel,
  message,
}) {
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(null);
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError(null);
      setloading(true);
      await onSubmit?.(e);
    } catch (err) {
      setError(err.message);
    } finally {
      setloading(false);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field) => (
        <FormField
          key={field.name}
          {...field}
          value={values[field.name] || ""}
          onChange={onChange}
        />
      ))}
      {error && <span style={{ color: "red" }}>{error}</span>}
      {message}
      <button type="submit" disabled={loading}>
        {loading ? "Loading..." : submitLabel}
      </button>
    </form>
  );
}