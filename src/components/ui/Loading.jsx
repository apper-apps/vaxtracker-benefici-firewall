import { motion } from 'framer-motion'

const Loading = ({ type = 'default' }) => {
  if (type === 'table') {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-8 gap-4 mb-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-4 bg-slate-200 rounded"></div>
          ))}
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="grid grid-cols-8 gap-4 mb-3">
            {[...Array(8)].map((_, j) => (
              <div key={j} className="h-8 bg-slate-100 rounded"></div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
              <div className="w-16 h-6 bg-slate-200 rounded"></div>
            </div>
            <div className="w-20 h-8 bg-slate-200 rounded mb-2"></div>
            <div className="w-32 h-4 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}

export default Loading