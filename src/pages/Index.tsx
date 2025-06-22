
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ThreeScene from "@/components/ThreeScene";
import FloatingMathSymbols from "@/components/FloatingMathSymbols";

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  const setupHeroScene = (scene: any, camera: any, renderer: any) => {
    if (!window.THREE) return;

    // Create floating Y2Prove logo
    const logoGeometry = new window.THREE.BoxGeometry(2, 0.5, 0.3);
    const logoMaterial = new window.THREE.MeshPhongMaterial({
      color: 0xF59E0B,
      emissive: 0x333300,
    });
    const logo = new window.THREE.Mesh(logoGeometry, logoMaterial);
    logo.position.set(-4, 3, 0);
    scene.add(logo);

    // Create floating geometric shapes
    const shapes = [];
    for (let i = 0; i < 20; i++) {
      const geometry = Math.random() > 0.5 
        ? new window.THREE.TetrahedronGeometry(0.3)
        : new window.THREE.OctahedronGeometry(0.3);
      
      const material = new window.THREE.MeshPhongMaterial({
        color: new window.THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.7, 0.6),
        transparent: true,
        opacity: 0.8,
      });
      
      const shape = new window.THREE.Mesh(geometry, material);
      shape.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      shapes.push(shape);
      scene.add(shape);
    }

    // Create light particles
    const particleGeometry = new window.THREE.BufferGeometry();
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 50;
    }

    particleGeometry.setAttribute('position', new window.THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new window.THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.1,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new window.THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Lighting
    const ambientLight = new window.THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new window.THREE.DirectionalLight(0x0EA5E9, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    camera.position.z = 10;

    // Animation
    const animate = () => {
      // Rotate logo
      logo.rotation.y += 0.01;
      logo.rotation.x += 0.005;

      // Animate shapes
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.01 * (index % 3 + 1);
        shape.rotation.y += 0.01 * (index % 2 + 1);
        shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
      });

      // Animate particles (upward motion)
      const positions = particles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += 0.02;
        if (positions[i] > 25) positions[i] = -25;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y += 0.001;

      requestAnimationFrame(animate);
    };
    animate();
  };

  return (
    <div className="min-h-screen relative">
      <FloatingMathSymbols />
      
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 z-0">
          <ThreeScene onSceneReady={setupHeroScene} />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-6xl md:text-8xl font-space font-bold text-white mb-6 animate-slide-in">
            Grow Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              Math Knowledge
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-12 animate-slide-in" style={{ animationDelay: '0.3s' }}>
            Experience the future of mathematical education with our immersive 3D learning platform
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center animate-slide-in" style={{ animationDelay: '0.6s' }}>
            <Link to="/about" className="neon-button text-white text-lg">
              Learn More
            </Link>
            
            <div className="flex gap-4">
              <Link to="/login?role=learner" className="glass-panel px-8 py-4 text-white font-semibold hover:bg-white/20 transition-all duration-300 rounded-xl">
                Learner
              </Link>
              <Link to="/login?role=teacher" className="glass-panel px-8 py-4 text-white font-semibold hover:bg-white/20 transition-all duration-300 rounded-xl">
                Teacher
              </Link>
              <Link to="/login?role=parent" className="glass-panel px-8 py-4 text-white font-semibold hover:bg-white/20 transition-all duration-300 rounded-xl">
                Parent
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
