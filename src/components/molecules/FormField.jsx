import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'

const FormField = ({ 
  type = 'input',
  label,
  value,
  onChange,
  options = [],
  required = false,
  error = '',
  placeholder = '',
  disabled = false,
  icon = null,
  className = '',
  ...props 
}) => {
  if (type === 'select') {
    return (
      <Select
        label={label}
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        error={error}
        required={required}
        disabled={disabled}
        className={className}
        {...props}
      />
    )
  }

  return (
    <Input
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      error={error}
      required={required}
      disabled={disabled}
      icon={icon}
      className={className}
      {...props}
    />
  )
}

export default FormField