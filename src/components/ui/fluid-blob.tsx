import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
uniform float time;
uniform vec4 resolution;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;
varying vec2 vUv;
uniform float time;
uniform vec4 resolution;

float PI = 3.141592653589793238;

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
    mat4 m = rotationMatrix(axis, angle);
    return (m * vec4(v, 1.0)).xyz;
}

float smin( float a, float b, float k ) {
    k *= 6.0;
    float h = max( k-abs(a-b), 0.0 )/k;
    return min(a,b) - h*h*h*k*(1.0/6.0);
}

float sphereSDF(vec3 p, float r) {
    return length(p) - r;
}

float sdf(vec3 p) {
    vec3 p1 = rotate(p, vec3(0.0, 0.0, 1.0), time/5.0);
    vec3 p2 = rotate(p, vec3(1.), -time/5.0);
    vec3 p3 = rotate(p, vec3(1., 1., 0.), -time/4.5);
    vec3 p4 = rotate(p, vec3(0., 1., 0.), -time/4.0);
    
    float final = sphereSDF(p1 - vec3(-0.5, 0.0, 0.0), 0.35);
    float nextSphere = sphereSDF(p2 - vec3(0.55, 0.0, 0.0), 0.3);
    final = smin(final, nextSphere, 0.1);
    nextSphere = sphereSDF(p2 - vec3(-0.8, 0.0, 0.0), 0.2);
    final = smin(final, nextSphere, 0.1);
    nextSphere = sphereSDF(p3 - vec3(1.0, 0.0, 0.0), 0.15);
    final = smin(final, nextSphere, 0.1);
    nextSphere = sphereSDF(p4 - vec3(0.45, -0.45, 0.0), 0.15);
    final = smin(final, nextSphere, 0.1);
    
    return final;
}

vec3 getNormal(vec3 p) {
    float d = 0.001;
    return normalize(vec3(
        sdf(p + vec3(d, 0.0, 0.0)) - sdf(p - vec3(d, 0.0, 0.0)),
        sdf(p + vec3(0.0, d, 0.0)) - sdf(p - vec3(0.0, d, 0.0)),
        sdf(p + vec3(0.0, 0.0, d)) - sdf(p - vec3(0.0, 0.0, d))
    ));
}

float rayMarch(vec3 rayOrigin, vec3 ray) {
    float t = 0.0;
    for (int i = 0; i < 100; i++) {
        vec3 p = rayOrigin + ray * t;
        float d = sdf(p);
        if (d < 0.001) return t;
        t += d;
        if (t > 100.0) break;
    }
    return -1.0;
}

void main() {
    vec2 newUV = (vUv - vec2(0.5)) * resolution.zw + vec2(0.5);
    vec3 cameraPos = vec3(0.0, 0.0, 5.0);
    vec3 ray = normalize(vec3((vUv - vec2(0.5)) * resolution.zw, -1));
    vec3 color = vec3(0.0);
    
    float t = rayMarch(cameraPos, ray);
    if (t > 0.0) {
        vec3 p = cameraPos + ray * t;
        vec3 normal = getNormal(p);
        float fresnel = pow(1.0 + dot(ray, normal), 3.0);
        color = vec3(fresnel);
        gl_FragColor = vec4(color, 1.0);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
`;

function LavaLampShader() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();
  
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    resolution: { value: new THREE.Vector4() }
  }), []);

  // Update resolution when size changes
  React.useEffect(() => {
    const { width, height } = size;
    const imageAspect = 1;
    let a1, a2;
    
    if (height / width > imageAspect) {
      a1 = (width / height) * imageAspect;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = (height / width) / imageAspect;
    }
    
    uniforms.resolution.value.set(width, height, a1, a2);
  }, [size, uniforms]);

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[5, 5]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

export const LavaLamp = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      // Force cleanup of canvas when component unmounts
      if (containerRef.current) {
        const canvas = containerRef.current.querySelector('canvas');
        if (canvas) {
          const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
          if (gl) {
            const loseContext = (gl as any).getExtension('WEBGL_lose_context');
            if (loseContext) {
              loseContext.loseContext();
            }
          }
        }
      }
    };
  }, []);

  // Use a container with proper isolation to prevent affecting other pages
  // This component should ONLY be used within the Strike page component
  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '100%', 
        height: '100%', 
        background: '#000', 
        position: "fixed", 
        top: 0, 
        left: 0, 
        zIndex: 0,
        isolation: 'isolate', // Create new stacking context
        contain: 'layout style paint', // Further isolate rendering
        willChange: 'transform' // Optimize for animations
      }}
    >
      <Canvas
        camera={{
          left: -0.5,
          right: 0.5,
          top: 0.5,
          bottom: -0.5,
          near: -1000,
          far: 1000,
          position: [0, 0, 2]
        }}
        orthographic
        gl={{ 
          antialias: true,
          alpha: false, // Ensure no transparency issues
          preserveDrawingBuffer: false, // Don't preserve canvas state
          powerPreference: 'high-performance'
        }}
        onCreated={({ gl }) => {
          // Ensure WebGL context is properly scoped
          gl.setClearColor('#000000', 1);
          gl.domElement.style.display = 'block';
          gl.domElement.style.position = 'absolute';
          gl.domElement.style.top = '0';
          gl.domElement.style.left = '0';
        }}
        dpr={[1, 2]} // Limit pixel ratio to prevent performance issues
      >
        <LavaLampShader />
      </Canvas>
    </div>
  );
}

