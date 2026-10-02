'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

type InspectionState = { x: number; y: number; active: boolean; full: boolean; reduced: boolean; paused: boolean };

function Sculpture({ state }: { state: React.RefObject<InspectionState> }) {
  const group = useRef<THREE.Group>(null);
  const { gl, size } = useThree();
  const lens = useMemo(() => ({ uLens: { value: new THREE.Vector2(-10000, -10000) }, uRadius: { value: 0 }, uFull: { value: 0 } }), []);
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const points = [[-1.45, -.15], [.08, 1.8], [.86, 1.8], [.86, .18], [1.36, .18], [1.36, -.54], [.86, -.54], [.86, -1.7], [.08, -1.7], [.08, -.54], [-1.45, -.54]];
    points.forEach(([x, y], i) => i ? shape.lineTo(x, y) : shape.moveTo(x, y)); shape.closePath();
    const hole = new THREE.Path(); hole.moveTo(-.53, .18); hole.lineTo(.08, .18); hole.lineTo(.08, 1.03); hole.closePath(); shape.holes.push(hole);
    const geo = new THREE.ExtrudeGeometry(shape, { depth: .65, bevelEnabled: true, bevelSegments: 8, steps: 1, bevelSize: .09, bevelThickness: .09, curveSegments: 16 });
    geo.center(); return geo;
  }, []);
  const material = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({ color: '#f97328', metalness: .43, roughness: .25, clearcoat: .9, clearcoatRoughness: .16 });
    mat.onBeforeCompile = shader => {
      Object.assign(shader.uniforms, lens);
      shader.fragmentShader = 'uniform vec2 uLens; uniform float uRadius; uniform float uFull;\n' + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace('#include <clipping_planes_fragment>', '#include <clipping_planes_fragment>\nif (uFull > 0.5 || distance(gl_FragCoord.xy, uLens) < uRadius) discard;');
    };
    return mat;
  }, [lens]);
  const wire = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial({ color: '#f97328', wireframe: true, transparent: true, opacity: .8, depthTest: false });
    mat.onBeforeCompile = shader => {
      Object.assign(shader.uniforms, lens);
      shader.fragmentShader = 'uniform vec2 uLens; uniform float uRadius; uniform float uFull;\n' + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace('#include <clipping_planes_fragment>', '#include <clipping_planes_fragment>\nif (uFull < 0.5 && distance(gl_FragCoord.xy, uLens) >= uRadius) discard;');
    };
    return mat;
  }, [lens]);
  useEffect(() => () => { geometry.dispose(); material.dispose(); wire.dispose(); }, [geometry, material, wire]);
  useFrame(({ clock }, delta) => {
    const s = state.current;
    if (!s) return;
    const dpr = gl.getPixelRatio();
    lens.uLens.value.set(s.x * dpr, (size.height - s.y) * dpr);
    lens.uRadius.value = s.active ? 95 * dpr : 0;
    lens.uFull.value = s.full ? 1 : 0;
    if (group.current && !s.paused) {
      const t = s.reduced ? 0 : clock.getElapsedTime();
      const targetX = -.13 + (s.active ? (s.y / size.height - .5) * .12 : 0);
      const targetY = -.48 + Math.sin(t * .22) * .18 + (s.active ? (s.x / size.width - .5) * .28 : 0);
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 3, delta);
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 3, delta);
      group.current.position.y = s.reduced ? 0 : Math.sin(t * .6) * .075;
    }
  });
  return <group ref={group} rotation={[-.13, -.48, -.13]}>
    <mesh geometry={geometry} material={material} />
    <mesh geometry={geometry} material={wire} />
    <mesh rotation={[Math.PI / 2.7, .35, .3]} position={[0, 0, -.35]}>
      <torusGeometry args={[2.05, .026, 8, 120]} /><meshStandardMaterial color="#b2b2b2" metalness={.7} roughness={.3} />
    </mesh>
    <mesh position={[1.38, .96, .5]}><sphereGeometry args={[.16, 24, 24]} /><meshPhysicalMaterial color="#202020" metalness={.8} roughness={.15} /></mesh>
  </group>;
}

export default function HeroScene({ state, onReady, running }: { state: React.RefObject<InspectionState>; onReady: () => void; running: boolean }) {
  return <Canvas frameloop={running ? 'always' : 'never'} dpr={[1, 1.5]} camera={{ position: [0, .08, 6.8], fov: 41 }} gl={{ alpha: true, antialias: true }} onCreated={onReady} aria-hidden="true">
    <ambientLight intensity={1.4} />
    <directionalLight position={[3, 5, 4]} intensity={4.5} color="#fff6ef" />
    <directionalLight position={[-4, 0, 2]} intensity={2.2} color="#ffffff" />
    <pointLight position={[0, -4, 3]} intensity={12} color="#f97328" />
    <Sculpture state={state} />
  </Canvas>;
}
