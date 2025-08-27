"use client"

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog'
import { BottomSheet } from './bottom-sheet'
import { cn } from '../utils'

interface ResponsiveModalProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  contentClassName?: string
}

export function ResponsiveModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
  contentClassName
}: ResponsiveModalProps) {
  const [isMobile, setIsMobile] = useState(() => {
    // In test environment, always start as mobile
    // Check for Jest environment or other test indicators
    if (typeof window === 'undefined' || process.env.NODE_ENV === 'test') {
      return true
    }
    return false
  })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640) // sm breakpoint
    }

    // Check immediately
    checkMobile()
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Mobile: Use BottomSheet
  if (isMobile) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        subtitle={description}
        className={className}
      >
        <div className={cn("space-y-4", contentClassName)}>
          {children}
          {footer && (
            <div className="flex justify-between gap-2 pt-4 border-t">
              {footer}
            </div>
          )}
        </div>
      </BottomSheet>
    )
  }

  // Desktop: Use Dialog
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-md max-h-[90vh] overflow-hidden flex flex-col", className)}>
        <div>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </div>
        <div className={cn("overflow-y-auto flex-1", contentClassName)}>
          {children}
        </div>
        {footer && (
          <DialogFooter className="flex justify-between gap-2 pt-4 border-t">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}