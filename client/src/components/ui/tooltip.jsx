import * as React from "react"
import { cn } from "@/lib/utils"

// Simple tooltip implementation without external dependencies
const TooltipProvider = ({ children }) => children

const TooltipContext = React.createContext({})

const Tooltip = ({ children, delayDuration = 700 }) => {
  const [open, setOpen] = React.useState(false)
  
  return (
    <TooltipContext.Provider value={{ open, setOpen, delayDuration }}>
      <div className="relative inline-flex">
        {children}
      </div>
    </TooltipContext.Provider>
  )
}

const TooltipTrigger = React.forwardRef(({ children, asChild, ...props }, ref) => {
  const { setOpen, delayDuration } = React.useContext(TooltipContext)
  const timeoutRef = React.useRef(null)
  
  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(true)
    }, delayDuration)
  }
  
  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current)
    setOpen(false)
  }
  
  React.useEffect(() => {
    return () => clearTimeout(timeoutRef.current)
  }, [])
  
  if (asChild) {
    return React.cloneElement(children, {
      ...props,
      ref,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    })
  }
  
  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  )
})
TooltipTrigger.displayName = "TooltipTrigger"

const TooltipContent = React.forwardRef(({ className, side = "top", sideOffset = 4, ...props }, ref) => {
  const { open } = React.useContext(TooltipContext)
  
  if (!open) return null
  
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 overflow-hidden rounded-md bg-slate-900 px-3 py-1.5 text-xs text-slate-50 shadow-md animate-in fade-in-0 zoom-in-95",
        positionClasses[side],
        className
      )}
      {...props}
    />
  )
})
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
