'use client';

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X, CheckCircle2, Loader2 } from 'lucide-react'
import { documentApi } from '../lib/api'
import toast from 'react-hot-toast'

export default function UploadZone({ onUploadSuccess }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback(acceptedFiles => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile) {
      setFile(selectedFile)
      handleUpload(selectedFile)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.ms-powerpoint': ['.ppt']
    },
    multiple: false
  })

  const handleUpload = async (fileToUpload) => {
    setUploading(true)
    try {
      const data = await documentApi.upload(fileToUpload)
      toast.success('File processed successfully!')
      if (onUploadSuccess) onUploadSuccess(data)
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error(error.response?.data?.detail || 'Upload failed. Please try again.')
      setFile(null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        {...getRootProps()} 
        className={`relative group cursor-pointer transition-all duration-500 rounded-[2rem] border-2 border-dashed
          ${isDragActive ? 'border-brand-500 bg-brand-50/50' : 'border-slate-200 hover:border-brand-500/50 bg-white hover:bg-slate-50/50'}
          ${file ? 'py-10' : 'py-24'} shadow-sm hover:shadow-xl`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center text-center px-6">
          {!file ? (
            <>
              <div className="w-32 h-32 rounded-[2.5rem] bg-brand-50 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-300 relative">
                <div className="absolute inset-0 bg-brand-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <img src="/logo.png" className="w-20 h-20 object-contain relative z-10" alt="Upload Logo" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-2 text-slate-900">Drop your lecture here</h3>
              <p className="text-slate-500 font-body font-medium max-w-sm">
                Support for PDF and PowerPoint presentations up to 50MB.
              </p>
            </>
          ) : (
            <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="flex items-center gap-5 mb-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center shadow-sm">
                  <FileText className="w-7 h-7 text-brand-600" />
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <p className="font-bold text-slate-900 truncate text-lg">{file.name}</p>
                  <p className="text-sm text-slate-400 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                {uploading ? (
                  <Loader2 className="w-7 h-7 text-brand-500 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                )}
              </div>
              
              {uploading && (
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative z-10">
                  <div className="h-full bg-brand-500 animate-shimmer bg-[length:200%_100%]" style={{ width: '100%' }} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
