import React, { useEffect, useRef, memo } from 'react';
import * as THREE from 'three';
import { HubData, LogisticsRoute } from './HubTelemetryWidget';
import { GLOBAL_HUBS, LOGISTICS_ROUTES, latLongToVector3 } from './globeData';

export { GLOBAL_HUBS, LOGISTICS_ROUTES, latLongToVector3 };


interface LogisticsGlobe3DProps {
  activeRoleFilter?: string;
  selectedHub?: HubData | null;
  setSelectedHub?: (hub: HubData) => void;
  hoveredHub?: HubData | null;
  setHoveredHub?: (hub: HubData | null) => void;
  setToolTipPosition?: (pos: { x: number; y: number }) => void;
  className?: string;
}

export const LogisticsGlobe3D: React.FC<LogisticsGlobe3DProps> = memo(({
  activeRoleFilter = 'all',
  selectedHub,
  setSelectedHub,
  hoveredHub,
  setHoveredHub,
  setToolTipPosition,
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const arcsGroupRef = useRef<THREE.Group | null>(null);
  const pulsesRef = useRef<Array<{
    mesh: THREE.Mesh;
    curve: THREE.QuadraticBezierCurve3;
    progress: number;
    speed: number;
    role: string;
  }>>([]);
  const hubMeshesRef = useRef<THREE.Group[]>([]);
  const isDraggingRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const autoRotateRef = useRef(true);
  const autoRotateTimerRef = useRef<number | null>(null);

  // Sync callbacks into refs to avoid recreating the Three.js scene unnecessarily
  const setHoveredHubRef = useRef(setHoveredHub);
  setHoveredHubRef.current = setHoveredHub;
  const setSelectedHubRef = useRef(setSelectedHub);
  setSelectedHubRef.current = setSelectedHub;
  const setToolTipPositionRef = useRef(setToolTipPosition);
  setToolTipPositionRef.current = setToolTipPosition;

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || window.innerWidth;
    const height = currentMount.clientHeight || window.innerHeight;
    const isMobile = window.innerWidth < 768;

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    // Set camera position to frame the globe comfortably without clipping
    const cameraZ = isMobile ? 38 : 34;
    camera.position.set(0, 4, cameraZ);
    camera.lookAt(0, 0, 0);

    // 3. Renderer Setup with Strict Damping & Disposal
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    // Limit pixel ratio on mobile to prevent thermal throttling & battery drain
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    currentMount.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.5);
    scene.add(ambientLight);

    const mainDirectionalLight = new THREE.DirectionalLight(0x38bdf8, 3.0);
    mainDirectionalLight.position.set(20, 30, 20);
    scene.add(mainDirectionalLight);

    const backAccentLight = new THREE.DirectionalLight(0x818cf8, 2.0);
    backAccentLight.position.set(-20, -10, -20);
    scene.add(backAccentLight);

    // 5. Root Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Responsive Desktop / Mobile Globe Offset to balance hero copy
    const updateGlobePosition = () => {
      if (window.innerWidth >= 1024) {
        globeGroup.position.set(6, -1, 0);
      } else {
        globeGroup.position.set(0, -2, 0);
      }
    };
    updateGlobePosition();

    const GLOBE_RADIUS = 12;

    // Track all allocated resources for explicit disposal
    const geometriesToDispose: THREE.BufferGeometry[] = [];
    const materialsToDispose: THREE.Material[] = [];

    // A. Dark Inner Sphere
    const innerSphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS - 0.1, 48, 48);
    geometriesToDispose.push(innerSphereGeo);
    const innerSphereMat = new THREE.MeshStandardMaterial({
      color: 0x050914,
      roughness: 0.85,
      metalness: 0.5,
      transparent: true,
      opacity: 0.95
    });
    materialsToDispose.push(innerSphereMat);
    const innerSphere = new THREE.Mesh(innerSphereGeo, innerSphereMat);
    globeGroup.add(innerSphere);

    // B. Matrix Lat/Long Point Grid (Dot Landmass Globe)
    // Reduce point count on mobile from 4,500 to 1,800
    const pointsCount = isMobile ? 1800 : 4500;
    const dotPositions: number[] = [];
    const dotColors: number[] = [];
    const baseColor = new THREE.Color(0x1e293b);
    const activeDotColor = new THREE.Color(0x0284c7);

    for (let i = 0; i < pointsCount; i++) {
      const lat = (Math.random() - 0.5) * 180;
      const lng = (Math.random() - 0.5) * 360;

      // Density curve prioritizing inhabited continental lat ranges
      if (Math.sin((lat * Math.PI) / 180) > 0.85 && Math.random() > 0.3) continue;

      const vec = latLongToVector3(lat, lng, GLOBE_RADIUS);
      dotPositions.push(vec.x, vec.y, vec.z);

      const color = Math.random() > 0.75 ? activeDotColor : baseColor;
      dotColors.push(color.r, color.g, color.b);
    }

    const dotGeo = new THREE.BufferGeometry();
    geometriesToDispose.push(dotGeo);
    dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dotPositions, 3));
    dotGeo.setAttribute('color', new THREE.Float32BufferAttribute(dotColors, 3));

    const dotMat = new THREE.PointsMaterial({
      size: isMobile ? 0.22 : 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    materialsToDispose.push(dotMat);
    const dotGrid = new THREE.Points(dotGeo, dotMat);
    globeGroup.add(dotGrid);

    // C. Glowing Wireframe Grid Overlay
    const wireGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 28, 28);
    geometriesToDispose.push(wireGeo);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      wireframe: true,
      transparent: true,
      opacity: 0.08
    });
    materialsToDispose.push(wireMat);
    const wireSphere = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(wireSphere);

    // D. Outer Atmosphere Fresnel Glow Shader
    const atmosphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS + 1.2, 48, 48);
    geometriesToDispose.push(atmosphereGeo);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
          gl_FragColor = vec4(0.06, 0.72, 0.98, 1.0) * intensity * 0.8;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    materialsToDispose.push(atmosphereMat);
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    globeGroup.add(atmosphere);

    // 6. Spawn Hub Markers
    const hubMap = new Map<string, THREE.Vector3>();
    hubMeshesRef.current = [];

    // Shared geometries for efficiency & easy disposal
    const sharedCoreGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const sharedRingGeo = new THREE.RingGeometry(0.45, 0.65, 24);
    const sharedBeamGeo = new THREE.CylinderGeometry(0.04, 0.12, 1.8, 12);
    sharedBeamGeo.translate(0, 0.9, 0);

    geometriesToDispose.push(sharedCoreGeo, sharedRingGeo, sharedBeamGeo);

    GLOBAL_HUBS.forEach((hub) => {
      const hubPos = latLongToVector3(hub.lat, hub.lng, GLOBE_RADIUS, 0.15);

      const hubGroup = new THREE.Group();
      hubGroup.position.copy(hubPos);
      hubGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), hubPos.clone().normalize());

      // Marker Core Sphere
      const coreMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      materialsToDispose.push(coreMat);
      const coreMesh = new THREE.Mesh(sharedCoreGeo, coreMat);
      hubGroup.add(coreMesh);

      // Outer Glowing Ring
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00f2fe,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      materialsToDispose.push(ringMat);
      const ringMesh = new THREE.Mesh(sharedRingGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      hubGroup.add(ringMesh);

      // Vertical Light Beam Projection
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending
      });
      materialsToDispose.push(beamMat);
      const beamMesh = new THREE.Mesh(sharedBeamGeo, beamMat);
      hubGroup.add(beamMesh);

      hubGroup.userData = { hubData: hub, coreMat, ringMat, beamMesh };
      globeGroup.add(hubGroup);

      hubMap.set(hub.id, hubPos);
      hubMeshesRef.current.push(hubGroup);
    });

    // 7. Spawn Bezier Logistics Arcs
    const arcsGroup = new THREE.Group();
    arcsGroupRef.current = arcsGroup;
    globeGroup.add(arcsGroup);

    pulsesRef.current = [];
    const sharedPulseGeo = new THREE.SphereGeometry(0.18, 10, 10);
    geometriesToDispose.push(sharedPulseGeo);

    LOGISTICS_ROUTES.forEach((route) => {
      const v1 = hubMap.get(route.from);
      const v2 = hubMap.get(route.to);
      if (!v1 || !v2) return;

      const distance = v1.distanceTo(v2);

      // Midpoint elevated proportionally to route distance
      const mid = v1.clone().add(v2).multiplyScalar(0.5);
      mid.normalize();
      mid.multiplyScalar(GLOBE_RADIUS + distance * 0.28);

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const points = curve.getPoints(isMobile ? 36 : 64);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      geometriesToDispose.push(arcGeo);

      const arcMat = new THREE.LineBasicMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: 0.4,
        linewidth: 1.5
      });
      materialsToDispose.push(arcMat);

      const arcLine = new THREE.Line(arcGeo, arcMat);
      arcLine.userData = { routeData: route };
      arcsGroup.add(arcLine);

      // Energy Pulse Mesh
      const pulseMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      });
      materialsToDispose.push(pulseMat);
      const pulseMesh = new THREE.Mesh(sharedPulseGeo, pulseMat);
      arcsGroup.add(pulseMesh);

      pulsesRef.current.push({
        mesh: pulseMesh,
        curve,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.004,
        role: route.role
      });
    });

    // 8. Pointer Raycasting & Interaction Setup
    const raycaster = new THREE.Raycaster();
    raycaster.params.Points = { threshold: 0.5 };
    const mouse = new THREE.Vector2();

    const resumeAutoRotate = () => {
      if (autoRotateTimerRef.current) window.clearTimeout(autoRotateTimerRef.current);
      autoRotateTimerRef.current = window.setTimeout(() => {
        autoRotateRef.current = true;
      }, 2500);
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Handle Mouse Drag Rotating Globe
      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousMousePositionRef.current.x;
        const deltaY = e.clientY - previousMousePositionRef.current.y;

        globeGroup.rotation.y += deltaX * 0.005;
        globeGroup.rotation.x += deltaY * 0.005;

        // Clamp Pitch X rotation to prevent inverted flipping
        globeGroup.rotation.x = Math.max(-1.0, Math.min(1.0, globeGroup.rotation.x));

        previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
        autoRotateRef.current = false;
        return;
      }

      // Skip raycasting on small mobile touch drags
      if (isMobile) return;

      // Raycast Hub Markers
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(hubMeshesRef.current, true);

      if (intersects.length > 0) {
        let topGroup: THREE.Object3D | null = intersects[0].object;
        while (topGroup && topGroup.parent && topGroup.parent !== globeGroup) {
          topGroup = topGroup.parent;
        }

        if (topGroup && topGroup.userData && topGroup.userData.hubData) {
          const hub = topGroup.userData.hubData as HubData;
          setHoveredHubRef.current?.(hub);

          // Calculate 2D Screen Position for Tooltip
          const worldPos = new THREE.Vector3();
          topGroup.getWorldPosition(worldPos);
          worldPos.project(camera);

          const screenX = ((worldPos.x + 1) * rect.width) / 2;
          const screenY = ((-worldPos.y + 1) * rect.height) / 2;

          setToolTipPositionRef.current?.({ x: screenX, y: screenY });
          currentMount.style.cursor = 'pointer';
          return;
        }
      }

      setHoveredHubRef.current?.(null);
      currentMount.style.cursor = 'grab';
    };

    const handlePointerDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      autoRotateRef.current = false;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      currentMount.style.cursor = 'grabbing';
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      currentMount.style.cursor = 'grab';
      resumeAutoRotate();
    };

    const handleClick = () => {
      if (hoveredHub && setSelectedHubRef.current) {
        setSelectedHubRef.current(hoveredHub);
      }
    };

    // Touch events for mobile gesture navigation
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        autoRotateRef.current = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - previousMousePositionRef.current.x;
        const deltaY = touch.clientY - previousMousePositionRef.current.y;

        // Allow rotation on horizontal drags, but don't prevent vertical page scrolling
        if (Math.abs(deltaX) > Math.abs(deltaY) * 0.8) {
          globeGroup.rotation.y += deltaX * 0.006;
          globeGroup.rotation.x += deltaY * 0.003;
          globeGroup.rotation.x = Math.max(-1.0, Math.min(1.0, globeGroup.rotation.x));
        }

        previousMousePositionRef.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    const handleTouchEnd = () => {
      resumeAutoRotate();
    };

    currentMount.addEventListener('mousemove', handlePointerMove);
    currentMount.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);
    currentMount.addEventListener('click', handleClick);

    currentMount.addEventListener('touchstart', handleTouchStart, { passive: true });
    currentMount.addEventListener('touchmove', handleTouchMove, { passive: true });
    currentMount.addEventListener('touchend', handleTouchEnd, { passive: true });

    // 9. Resize Listener
    const handleResize = () => {
      if (!currentMount) return;
      const newW = currentMount.clientWidth;
      const newH = currentMount.clientHeight;

      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();

      renderer.setSize(newW, newH);
      updateGlobePosition();
    };
    window.addEventListener('resize', handleResize);

    // 10. Master Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous Slow Auto-Rotation
      if (autoRotateRef.current) {
        globeGroup.rotation.y += 0.0015;
      }

      // Animate Logistics Route Pulses
      pulsesRef.current.forEach((pulse) => {
        pulse.progress += pulse.speed;
        if (pulse.progress > 1) pulse.progress = 0;

        const pos = pulse.curve.getPoint(pulse.progress);
        pulse.mesh.position.copy(pos);
      });

      // Animate Hub Marker Rings scale
      hubMeshesRef.current.forEach((group, idx) => {
        const ring = group.userData.ringMat;
        if (ring) {
          const pulseScale = 1 + Math.sin(elapsedTime * 3 + idx) * 0.15;
          group.scale.set(pulseScale, pulseScale, pulseScale);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // 11. Rigorous GPU Memory & WebGL Context Teardown
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (autoRotateTimerRef.current) clearTimeout(autoRotateTimerRef.current);

      currentMount.removeEventListener('mousemove', handlePointerMove);
      currentMount.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      currentMount.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);

      currentMount.removeEventListener('touchstart', handleTouchStart);
      currentMount.removeEventListener('touchmove', handleTouchMove);
      currentMount.removeEventListener('touchend', handleTouchEnd);

      // Dispose all registered geometries
      geometriesToDispose.forEach((geo) => {
        try {
          geo.dispose();
        } catch {}
      });

      // Dispose all registered materials
      materialsToDispose.forEach((mat) => {
        try {
          mat.dispose();
        } catch {}
      });

      // Recursive scene cleanup
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.Line) {
          if (obj.geometry) {
            try {
              obj.geometry.dispose();
            } catch {}
          }
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => {
                try {
                  m.dispose();
                } catch {}
              });
            } else {
              try {
                obj.material.dispose();
              } catch {}
            }
          }
        }
      });

      // Dispose renderer and detach WebGL canvas
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  // Dynamic Route & Pulse Filter based on activeRoleFilter
  useEffect(() => {
    if (!arcsGroupRef.current) return;

    arcsGroupRef.current.children.forEach((child) => {
      if (child.userData && child.userData.routeData) {
        const route = child.userData.routeData as LogisticsRoute;
        const lineMat = (child as THREE.Line).material as THREE.LineBasicMaterial;

        if (activeRoleFilter === 'all' || route.role === activeRoleFilter) {
          lineMat.opacity = 0.55;
          lineMat.color.setHex(0x38bdf8);
        } else {
          lineMat.opacity = 0.1;
          lineMat.color.setHex(0x334155);
        }
      }
    });

    pulsesRef.current.forEach((pulse) => {
      if (activeRoleFilter === 'all' || pulse.role === activeRoleFilter) {
        pulse.mesh.visible = true;
      } else {
        pulse.mesh.visible = false;
      }
    });
  }, [activeRoleFilter]);

  // Visually highlight selected terminal on 3D globe
  useEffect(() => {
    if (!hubMeshesRef.current || !selectedHub) return;

    hubMeshesRef.current.forEach((group) => {
      const hubData = group.userData?.hubData as HubData | undefined;
      const coreMat = group.userData?.coreMat as THREE.MeshBasicMaterial | undefined;
      const ringMat = group.userData?.ringMat as THREE.MeshBasicMaterial | undefined;

      if (hubData && coreMat && ringMat) {
        if (hubData.id === selectedHub.id) {
          coreMat.color.setHex(0x00f2fe);
          ringMat.color.setHex(0x38bdf8);
          ringMat.opacity = 1.0;
        } else {
          coreMat.color.setHex(0x0284c7);
          ringMat.color.setHex(0x0369a1);
          ringMat.opacity = 0.6;
        }
      }
    });
  }, [selectedHub]);

  return (
    <div
      ref={mountRef}
      className={`w-full h-full absolute inset-0 bg-transparent select-none cursor-grab active:cursor-grabbing ${className}`}
      aria-label="Interactive 3D Logistics Globe"
    />
  );
});

export default LogisticsGlobe3D;
