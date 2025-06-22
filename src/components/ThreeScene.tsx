import { useEffect, useRef } from "react";

interface ThreeSceneProps {
  onSceneReady?: (scene: any, camera: any, renderer: any) => void;
  className?: string;
}

const ThreeScene = ({ onSceneReady, className = "" }: ThreeSceneProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const animationIdRef = useRef<number>();

  useEffect(() => {
    if (!mountRef.current || !window.THREE) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    
    const scene = new window.THREE.Scene();
    const camera = new window.THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    
    const renderer = new window.THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x111827, 1); 
    mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;

    
    if (onSceneReady) {
      onSceneReady(scene, camera, renderer);
    }

    
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    
    const handleResize = () => {
      if (!mountRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    
    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener("resize", handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onSceneReady]);

  return <div ref={mountRef} className={`w-full h-full relative ${className}`} />;
};

export default ThreeScene;
