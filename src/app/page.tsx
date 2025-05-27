'use client'

import FileUploader from '@/components/FileUploader'
import FileList from '@/components/FileList'
import Viewer from '@/components/Viewer'
import { useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib'
import { FBXLoader } from 'three-stdlib'
import { MTLLoader, OBJLoader } from 'three-stdlib'


export default function Page() {
  const [model, setModel] = useState<THREE.Object3D | null>(null)
  const [refreshKey, setRefreshKey] = useState<number>(0)

  const handleSelect = async (url: string) => {
    const ext = url.split('.').pop()?.toLowerCase()

    if (ext === 'glb' || ext === 'gltf') {
      const loader = new GLTFLoader()
      loader.load(url, (gltf) => setModel(gltf.scene))
    } else if (ext === 'fbx') {
      const loader = new FBXLoader()
      loader.load(url, (obj) => {
        obj.scale.set(1, 1, 1)
        setModel(obj)
      })
    } else if (ext === 'obj') {
      const basePath = url.substring(0, url.lastIndexOf('/') + 1)
      const fileName = url.split('/').pop() || ''
      const baseName = fileName.replace('.obj', '')
  
      // .mtl URL推測
      const mtlUrl = basePath + baseName + '.mtl'
  
      try {
        const mtlLoader = new MTLLoader()
        mtlLoader.setMaterialOptions({ side: THREE.DoubleSide })
        mtlLoader.load(mtlUrl, (materials) => {
          materials.preload()
  
          const objLoader = new OBJLoader()
          objLoader.setMaterials(materials)
          objLoader.load(url, (obj) => {
            setModel(obj)
          })
        })
      } catch {
        console.warn('❌ .mtl が見つからないか読み込み失敗、マテリアルなしで表示')
        const objLoader = new OBJLoader()
        objLoader.load(url, (obj) => setModel(obj))
      }
    }
  }


  return (
    <main className="min-h-screen bg-black text-white p-4 flex flex-row gap-4">
  {/* 左側：ファイルアップロード＋リスト */}
  <div className="lg:w-1/3 w-full flex flex-col gap-4">
        <FileUploader onUploadComplete={() => setRefreshKey(Date.now())} />
        <FileList onSelect={handleSelect} refetchTrigger={refreshKey} />
      </div>

  {/* 右側：3D Viewer */}
  <div className="w-2/3 h-full bg-slate-700">
    <Viewer model={model} />
  </div>
</main>
  )
}
