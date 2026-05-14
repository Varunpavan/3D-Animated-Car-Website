import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function ParticleField({ pointer }) {
  const points = useRef();
  const particles = useMemo(() => {
    const count = 820;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 18;
      positions[i3 + 1] = (Math.random() - 0.5) * 8;
      positions[i3 + 2] = -Math.random() * 18 - 2;
      const heat = Math.random();
      colors[i3] = 0.65 + heat * 0.35;
      colors[i3 + 1] = 0.05 + heat * 0.1;
      colors[i3 + 2] = 0.08 + heat * 0.12;
    }

    return { positions, colors };
  }, []);

  useFrame(({ clock }) => {
    if (!points.current) return;
    const t = clock.elapsedTime;
    points.current.rotation.y = Math.sin(t * 0.08) * 0.07 + (pointer.x - 0.5) * 0.16;
    points.current.rotation.x = Math.cos(t * 0.1) * 0.03 + (pointer.y - 0.5) * 0.08;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particles.positions.length / 3} array={particles.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particles.colors.length / 3} array={particles.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial vertexColors size={0.035} sizeAttenuation transparent opacity={0.58} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function StudioRim({ pointer }) {
  const mesh = useRef();

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    mesh.current.material.uniforms.uTime.value = clock.elapsedTime;
    mesh.current.material.uniforms.uPointer.value.set(pointer.x, pointer.y);
  });

  const shader = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uPointer;

        void main() {
          vec2 uv = vUv;
          float sweep = smoothstep(0.75, 0.08, abs(uv.y - 0.47 - sin(uTime * 0.28) * 0.04));
          float cursor = 1.0 - smoothstep(0.0, 0.62, distance(uv, uPointer));
          float floorGlow = smoothstep(0.72, 0.35, abs(uv.y - 0.78));
          vec3 red = vec3(1.0, 0.05, 0.1);
          vec3 blueSteel = vec3(0.38, 0.52, 0.64);
          vec3 color = red * sweep * 0.17 + red * floorGlow * 0.08 + blueSteel * cursor * 0.045;
          float vignette = smoothstep(0.88, 0.24, distance(uv, vec2(0.5)));
          gl_FragColor = vec4(color * vignette, 1.0);
        }
      `,
    }),
    [],
  );

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial args={[shader]} depthWrite={false} depthTest={false} />
    </mesh>
  );
}

export function SceneChrome({ pointer, quality = 'high' }) {
  const isLow = quality === 'low';

  return (
    <Canvas className="scene-chrome" camera={{ position: [0, 0, 5], fov: 45 }} dpr={isLow ? [1, 1.25] : [1, 1.75]} gl={{ antialias: !isLow, alpha: true, powerPreference: 'high-performance' }}>
      <color attach="background" args={['#050505']} />
      <StudioRim pointer={pointer} />
      <ParticleField pointer={pointer} />
      {!isLow && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.78} luminanceThreshold={0.14} luminanceSmoothing={0.7} mipmapBlur />
          <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0007, 0.0009]} />
          <Vignette eskil={false} offset={0.22} darkness={0.78} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
