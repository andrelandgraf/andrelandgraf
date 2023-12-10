/* eslint-disable react/no-unknown-property */
import { PerspectiveCamera, useGLTF } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import { Canvas, useFrame } from '@react-three/fiber';
import type { MutableRefObject } from 'react';
import { Suspense, useEffect, useRef, useState } from 'react';
import type { Group, Object3DEventMap } from 'three';

const baseX = 0;
const baseZ = -Math.PI / 2;

type DragData = {
  timestamp: number;
  movementX: number;
  movementY: number;
};

export function Book3DModel({ hoveredRef }: { hoveredRef: MutableRefObject<boolean> }) {
  // size: {x: 150, y: 185, z: 15}
  const ref = useRef<Group<Object3DEventMap>>(null);
  const draggedRef = useRef<DragData | null>(null);
  const { nodes, materials } = useGLTF('/book-v1.glb');
  useFrame(() => {
    if (!ref.current || hoveredRef.current) return;
    const fourSecondsSinceDrag = !draggedRef.current || Date.now() - draggedRef.current.timestamp > 4000;
    const stoppedDragging = !draggedRef.current || Date.now() - draggedRef.current.timestamp > 200;
    if (!draggedRef.current || fourSecondsSinceDrag) {
      ref.current.rotation.y += 0.005;
      // slowly back to base x and z
      if (ref.current.rotation.z > baseZ) {
        ref.current.rotation.z -= 0.005;
      } else if (ref.current.rotation.y < baseZ) {
        ref.current.rotation.z += 0.005;
      }
      if (ref.current.rotation.x > baseX) {
        ref.current.rotation.x -= 0.005;
      } else if (ref.current.rotation.x < baseX) {
        ref.current.rotation.x += 0.005;
      }
    } else if (stoppedDragging) {
      // move further to dragged position
      ref.current.rotation.x += draggedRef.current.movementY * 0.0001;
      ref.current.rotation.y += draggedRef.current.movementX * 0.0001;
    }
  });

  function onDrag(e: ThreeEvent<PointerEvent>) {
    if (!ref.current) return;
    const { movementX, movementY } = e;
    draggedRef.current = {
      timestamp: Date.now(),
      movementX,
      movementY,
    };
    ref.current.rotation.x += movementY * 0.001;
    ref.current.rotation.y += movementX * 0.001;
  }

  return (
    <group
      ref={ref}
      dispose={null}
      position={[0, 0, 0]}
      scale={[1, 1, 1]}
      rotation={[baseX, -Math.PI / 3, baseZ]}
      onPointerMove={onDrag}
    >
      <mesh geometry={nodes.Cube.geometry} material={materials.Cover} />
      <mesh geometry={nodes.Cube_1.geometry} material={materials.Back} />
      <mesh geometry={nodes.Cube_2.geometry} material={materials.Side} />
      <mesh geometry={nodes.Cube_3.geometry} material={materials.Paper} />
    </group>
  );
}

export function Book3DScene() {
  const [hovered, setHover] = useState(false);
  const hoveredRef = useRef(hovered);

  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  return (
    <Canvas onPointerOver={(e) => setHover(true)} onPointerOut={(e) => setHover(false)}>
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault position={[0, 0, 300]} rotation={[0, 0, 0]} fov={50} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[0, 500, 500]} intensity={hovered ? 1.2 : 1} />
        <Book3DModel hoveredRef={hoveredRef} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload('/book-v1.glb');
