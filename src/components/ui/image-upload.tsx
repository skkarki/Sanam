'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  onUpload: (result: {
    publicId: string
    url: string
    format: string
    width: number
    height: number
  }) => void
  folder?: string
  maxSize?: number // in MB
  accept?: string
  className?: string
  disabled?: boolean
}

export function ImageUpload({
  onUpload,
  folder = 'sanam-international',
  maxSize = 5,
  accept = 'image/*',
  className = '',
  disabled = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    setError(null)
    setPreview(URL.createObjectURL(file))

    // Upload the file
    uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const result = await response.json()
      onUpload(result.data)
      setProgress(100)
    } catch (error) {
      console.error('Upload error:', error)
      setError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    setError(null)
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {preview ? (
        <div className="relative group">
          <div className="relative overflow-hidden rounded-lg border">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-full max-w-xs px-4">
                  <Progress value={progress} className="w-full" />
                  <p className="text-white text-center mt-2 text-sm">
                    Uploading... {progress}%
                  </p>
                </div>
              </div>
            )}
          </div>
          {!isUploading && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div
          onClick={triggerFileInput}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-primary ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          } ${isUploading ? 'pointer-events-none' : ''}`}
        >
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              {isUploading ? (
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
              ) : (
                <Upload className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">
                {isUploading ? 'Uploading...' : 'Click to upload image'}
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF up to {maxSize}MB
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground text-center">
            Uploading... {progress}%
          </p>
        </div>
      )}
    </div>
  )
}
