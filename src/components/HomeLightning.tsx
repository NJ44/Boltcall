import React, { useRef, useEffect } from "react";

interface HomeLightningProps {
  className?: string;
}

export const HomeLightning: React.FC<HomeLightningProps> = ({ 
  className = "w-full h-full"
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    const vertexShaderSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform float uHue;
      uniform float uXOffset;
      uniform float uSpeed;
      uniform float uIntensity;
      uniform float uSize;

      #define OCTAVE_COUNT 10

      // Convert HSV to RGB.
      vec3 hsv2rgb(vec3 c) {
        vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
        return c.z * mix(vec3(1.0), rgb, c.y);
      }

      float hash11(float p) {
        p = fract(p * .1031);
        p *= p + 33.33;
        p *= p + p;
        return fract(p);
      }

      float hash12(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * .1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
      }

      mat2 rotate2d(float theta) {
        float c = cos(theta);
        float s = sin(theta);
        return mat2(c, -s, s, c);
      }

      float noise(vec2 p) {
        vec2 ip = floor(p);
        vec2 fp = fract(p);
        float a = hash12(ip);
        float b = hash12(ip + vec2(1.0, 0.0));
        float c = hash12(ip + vec2(0.0, 1.0));
        float d = hash12(ip + vec2(1.0, 1.0));
        vec2 t = smoothstep(0.0, 1.0, fp);
        return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < OCTAVE_COUNT; ++i) {
          value += amplitude * noise(p);
          p *= rotate2d(0.45);
          p *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
        // Normalized pixel coordinates.
        vec2 uv = fragCoord / iResolution.xy;
        uv = 2.0 * uv - 1.0;
        uv.x *= iResolution.x / iResolution.y;

        // Apply horizontal offset.
        uv.x += uXOffset;

        // Adjust uv based on size and animate with speed.
        uv += 2.0 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 1.0;
        float dist = abs(uv.x);

        // Compute base color using hue.
        vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));

        // Compute color with intensity and speed affecting time - ENHANCED!
        vec3 col = baseColor * pow(mix(0.0, 0.12, hash11(iTime * uSpeed)) / dist, 0.95) * uIntensity;
        col = pow(col, vec3(0.85)); // More vibrant glow

        fragColor = vec4(col, 1.0);
      }

      void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
      }
    `;

    const compileShader = (
      source: string,
      type: number
    ): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(
      fragmentShaderSource,
      gl.FRAGMENT_SHADER
    );

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const vertices = new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      -1, 1,
      1, -1,
      1, 1,
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
    const iTimeLocation = gl.getUniformLocation(program, "iTime");
    const uHueLocation = gl.getUniformLocation(program, "uHue");
    const uXOffsetLocation = gl.getUniformLocation(program, "uXOffset");
    const uSpeedLocation = gl.getUniformLocation(program, "uSpeed");
    const uIntensityLocation = gl.getUniformLocation(program, "uIntensity");
    const uSizeLocation = gl.getUniformLocation(program, "uSize");

    const startTime = performance.now();
    let nextBurstTime = Math.random() * 8000 + 5000; // First burst in 5-13 seconds (less frequent)
    let isBursting = false;
    let burstStartTime = 0;
    let burstDuration = 0;
    let isDoubleBurst = false;
    let waitingForSecondBurst = false;
    let secondBurstDelay = 0;

    const render = () => {
      resizeCanvas();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(iResolutionLocation, canvas.width, canvas.height);

      const currentTime = performance.now();
      const elapsedTime = (currentTime - startTime) / 1000.0;
      const timeSinceStart = currentTime - startTime;
      
      // Lightning burst logic - more random intervals between 3-8 seconds
      if (!isBursting && !waitingForSecondBurst && timeSinceStart > nextBurstTime) {
        isBursting = true;
        burstStartTime = currentTime;
        burstDuration = Math.random() * 150 + 880; // Burst lasts 880-1030ms (0.8s longer)
        
        // 40% chance of double burst
        isDoubleBurst = Math.random() < 0.4;
        
        if (!isDoubleBurst) {
          nextBurstTime = timeSinceStart + Math.random() * 8000 + 5000; // Next burst in 5-13 seconds (less frequent)
        }
      }

      // Calculate smooth fade in/out during burst
      let burstIntensity = 0.0;
      if (isBursting) {
        const burstProgress = (currentTime - burstStartTime) / burstDuration;
        
        if (burstProgress < 1.0) {
          // Smoother fade with cubic easing
          const easeInOut = burstProgress < 0.5 
            ? 4 * burstProgress * burstProgress * burstProgress 
            : 1 - Math.pow(-2 * burstProgress + 2, 3) / 2;
          burstIntensity = easeInOut * 1.2; // MASSIVE glow - 3x stronger!
        } else {
          isBursting = false;
          
          // Handle double burst
          if (isDoubleBurst && !waitingForSecondBurst) {
            waitingForSecondBurst = true;
            secondBurstDelay = currentTime + (Math.random() * 150 + 100); // 100-250ms delay
          }
        }
      }
      
      // Trigger second burst if needed
      if (waitingForSecondBurst && currentTime > secondBurstDelay) {
        waitingForSecondBurst = false;
        isBursting = true;
        burstStartTime = currentTime;
        burstDuration = Math.random() * 150 + 880; // Burst lasts 880-1030ms (0.8s longer)
        isDoubleBurst = false;
        nextBurstTime = timeSinceStart + Math.random() * 8000 + 5000; // Next burst in 5-13 seconds (less frequent)
      }

      gl.uniform1f(iTimeLocation, elapsedTime);
      gl.uniform1f(uHueLocation, 220); // Blue hue
      gl.uniform1f(uXOffsetLocation, 0);
      gl.uniform1f(uSpeedLocation, 0.072);
      gl.uniform1f(uIntensityLocation, burstIntensity);
      gl.uniform1f(uSizeLocation, 1.5); // Bigger lightning (was 2)

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
};
