'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Grid } from '@react-three/drei'
import * as THREE from 'three'
import { useState, useEffect } from 'react'
import { GridHelper } from 'three'

type ViewerProps = {
  model: THREE.Object3D | null
}

export default function Viewer({ model }: ViewerProps) {
  const [showGrid, setShowGrid] = useState(true)
  const [backgroundType, setBackgroundType] = useState<'color' | 'environment'>('color')
  const [backgroundColor, setBackgroundColor] = useState('#1e1e1e')
  const [scale, setScale] = useState(1)
  const [lightType, setLightType] = useState<'ambient' | 'directional' | 'point'>('ambient')
  const [lightColor, setLightColor] = useState('#ffffff')
  const [lightPosition, setLightPosition] = useState<[number, number, number]>([5, 5, 5])

  // ✅ モデルのマテリアルをコンソールに表示
  useEffect(() => {
    if (model) {
      model.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          console.log('🟢 Mesh:', mesh.name)
          console.log('🎨 Material:', mesh.material)
        }
      })
    }
  }, [model])

  const renderLight = () => {
    switch (lightType) {
      case 'ambient':
        return <ambientLight color={lightColor} />
      case 'directional':
        return <directionalLight color={lightColor} position={lightPosition} />
      case 'point':
        return <pointLight color={lightColor} position={lightPosition} />
      default:
        return null
    }
  }

  return (
    <div className="w-full h-[calc(100vh-10rem)] flex flex-col gap-2">
      {/* 🔘 UIエリア */}
      <div className="flex flex-wrap gap-4 p-2 bg-gray-800 rounded">
        {/* グリッド切替 */}
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={showGrid} onChange={() => setShowGrid(!showGrid)} />
          グリッド表示
        </label>

        {/* 背景切替 */}
        <select
          value={backgroundType}
          onChange={(e) => setBackgroundType(e.target.value as 'color' | 'environment')}
          className='bg-black'
        >
          <option value="color">背景：単色</option>
          <option value="environment">背景：風景</option>
        </select>

        {/* 背景色 */}
        {backgroundType === 'color' && (
          <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} />
        )}

        {/* モデルの拡大縮小 */}
        <label>
          スケール
          <input
            type="range"
            min={0.1}
            max={3}
            step={0.1}
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
          />
        </label>

        {/* ライトの種類 */}
        <select
          value={lightType}
          onChange={(e) => setLightType(e.target.value as 'ambient' | 'directional' | 'point')}
          className='bg-black'
        >
          <option value="ambient">アンビエント</option>
          <option value="directional">ディレクショナル</option>
          <option value="point">ポイント</option>
        </select>

        {/* ライト色 */}
        <input type="color" value={lightColor} onChange={(e) => setLightColor(e.target.value)} />
      </div>

      {/* 🧱 Canvasエリア */}
      <Canvas style={{ background: backgroundType === 'color' ? backgroundColor : 'transparent' }}>
        <OrbitControls />
        {renderLight()}
        {backgroundType === 'environment' && <Environment preset="sunset" background />}
        {showGrid && <Grid />}
        {model && <primitive object={model} scale={scale} />}
      </Canvas>
    </div>
  )
}
