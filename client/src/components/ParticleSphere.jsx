// src/components/ParticleSphere.jsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 这是粒子组件的核心逻辑
const Particles = ({ count = 3000 }) => {
  const mesh = useRef();

  // 1. 生成几千个随机坐标点，组成一个球体
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // 这里的数学公式是用来把点均匀分布在球体表面的
      const theta = THREE.MathUtils.randFloatSpread(360); 
      const phi = THREE.MathUtils.randFloatSpread(360); 

      // 简单的球坐标转换
      const x = 2 * Math.sin(theta) * Math.cos(phi);
      const y = 2 * Math.sin(theta) * Math.sin(phi);
      const z = 2 * Math.cos(theta);

      positions.set([x, y, z], i * 3);
    }
    return positions;
  }, [count]);

  // 2. 动画循环：让球体自己慢慢转动
  useFrame((state) => {
    if (!mesh.current) return;
    // 每一帧转动一点点，模拟漂浮感
    mesh.current.rotation.y += 0.002;
    mesh.current.rotation.x += 0.001;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      {/* 粒子的材质：淡蓝色，发光 */}
      <pointsMaterial
        size={0.03}
        color="#5e88fc"
        transparent
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  );
};

// 这是最终导出的组件：一个包含了相机和粒子的 3D 舞台
const ParticleSphere = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        {/*甚至不需要灯光，因为粒子是自发光的*/}
        <Particles count={4000} />
      </Canvas>
    </div>
  );
};

export default ParticleSphere;