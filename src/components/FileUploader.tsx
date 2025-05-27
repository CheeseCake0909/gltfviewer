'use client'

import { supabase } from '@/lib/supabase'
import { useRef } from 'react'

export default function FileUploader({
  onUploadComplete,
}: {
  onUploadComplete?: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  // D&Dと同じアップロード処理
  const uploadFiles = async (files: File[]) => {
    for (const file of files) {
      const filePath = `uploads/${file.name}`
      await supabase.storage.from('models').remove([filePath]) // 上書き用
      const { error } = await supabase.storage.from('models').upload(filePath, file)
      if (error) console.error(error)
    }
    alert('アップロード完了！')
    onUploadComplete?.()
  }

  // ドラッグ＆ドロップ対応
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    uploadFiles(files)
  }

  // ファイル選択ボタンでアップロード
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      uploadFiles(Array.from(files))
    }
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="w-full border-2 border-dashed border-white p-4 flex flex-col items-center justify-center gap-4"
    >
      <p>モデルファイルをドラッグ＆ドロップするか、下のボタンで選択</p>
      <button
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
        onClick={() => inputRef.current?.click()}
      >
        ファイルを選択
      </button>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={handleChange}
        multiple
        accept=".glb,.gltf,.fbx,.obj,.mtl,.jpg,.png"
      />
    </div>
  )
}
