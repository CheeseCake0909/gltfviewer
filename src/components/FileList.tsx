'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { Disclosure } from '@headlessui/react'

type FileMeta = {
  name: string
  url: string
}

export default function FileList({ onSelect,refetchTrigger }: { onSelect: (url: string) => void; refetchTrigger?: number }) {
  const [files, setFiles] = useState<FileMeta[]>([])

  const fetchFiles = async () => {
    const { data, error } = await supabase.storage.from('models').list('uploads', {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    })

    if (error) {
      console.error('一覧取得エラー:', error)
      return
    }

    const fileList = data
      ?.filter((item) =>
        item.name &&
        !item.name.endsWith('/') &&
        item.name !== '.emptyFolderPlaceholder'
      )
      .map((file) => ({
        name: file.name,
        url: supabase.storage.from('models').getPublicUrl(`uploads/${file.name}`).data.publicUrl,
      }))

    setFiles(fileList || [])
  }

  useEffect(() => {
    fetchFiles()
  }, [refetchTrigger])

  const handleDelete = async (name: string) => {
    const { error } = await supabase.storage.from('models').remove([`uploads/${name}`])
    if (error) {
      alert('削除に失敗しました')
      console.error(error)
    } else {
      alert(`${name} を削除しました`)
      fetchFiles() // 削除後に再取得
    }
  }

  return (
    <div className="w-full mt-4">
      <Disclosure defaultOpen>
        {({ open }) => (
          <>
            <Disclosure.Button className="w-full px-4 py-2 text-left bg-gray-700">
              {open ? '▼ アップロード済みファイル一覧' : '▶ アップロード済みファイル一覧'}
            </Disclosure.Button>
            <Disclosure.Panel className="bg-gray-800 px-4 py-2">
              <ul className="space-y-2">
                {files.map((file) => (
                  <li key={file.name} className="flex justify-between items-center">
                    <button
                      className="text-blue-400 underline hover:text-blue-200"
                      onClick={() => onSelect(file.url)}
                    >
                      {file.name}
                    </button>
                    <button
                      className="text-red-400 hover:text-red-200 text-sm"
                      onClick={() => handleDelete(file.name)}
                    >
                      削除
                    </button>
                  </li>
                ))}
              </ul>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  )
}
