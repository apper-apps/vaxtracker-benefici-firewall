import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  icon = null,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick = () => {},
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg focus:ring-primary",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-500",
    outline: "border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
    ghost: "text-slate-600 hover:bg-slate-100 focus:ring-slate-500",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg focus:ring-red-500",
    success: "bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg focus:ring-green-500"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  }
  
  const isDisabled = disabled || loading
  
  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={!isDisabled ? onClick : undefined}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
      )}
      {icon && iconPosition === 'left' && !loading && (
        <ApperIcon name={icon} className="w-4 h-4 mr-2" />
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <ApperIcon name={icon} className="w-4 h-4 ml-2" />
      )}
    </motion.button>
  )
}

export default Button