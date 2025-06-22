
import { useEffect, useRef } from "react";
import ThreeScene from "@/components/ThreeScene";
import FloatingMathSymbols from "@/components/FloatingMathSymbols";

const Team = () => {
  const teamMembers = [
    {
      name: "Mr. Noorul",
      role: "Lead Mathematician",
      bio: "PhD in Applied Mathematics with 15+ years in educational technology",
      image: "👩‍🏫"
    },
    {
      name: "Prof. Michael Rodriguez",
      role: "3D Learning Specialist",
      bio: "Expert in immersive educational experiences and visual learning",
      image: "👨‍💻"
    },
    {
      name: "Dr. Emily Watson",
      role: "Curriculum Director",
      bio: "Former MIT professor specializing in innovative teaching methods",
      image: "👩‍🔬"
    },
    {
      name: "James Thompson",
      role: "UX/3D Designer",
      bio: "Award-winning designer focused on intuitive learning interfaces",
      image: "🎨"
    }
  ];

  const setupTeamScene = (scene: any, camera: any, renderer: any) => {
    const cubeGroup = new window.THREE.Group();
    
    // Create rotating cube for team showcase
    const cubeSize = 4;
    const geometry = new window.THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    
    teamMembers.forEach((member, index) => {
      // Create a face for each team member
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 512;
      canvas.height = 512;
      
      if (context) {
        // Background gradient
        const gradient = context.createLinearGradient(0, 0, 0, 512);
        gradient.addColorStop(0, '#0EA5E9');
        gradient.addColorStop(1, '#1E40AF');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 512, 512);
        
        // Member info
        context.fillStyle = 'white';
        context.font = 'bold 48px Arial';
        context.textAlign = 'center';
        context.fillText(member.image, 256, 180);
        
        context.font = 'bold 32px Arial';
        context.fillText(member.name, 256, 250);
        
        context.font = '24px Arial';
        context.fillStyle = '#F59E0B';
        context.fillText(member.role, 256, 290);
        
        context.font = '18px Arial';
        context.fillStyle = 'white';
        const words = member.bio.split(' ');
        let line = '';
        let y = 330;
        
        words.forEach(word => {
          const testLine = line + word + ' ';
          const metrics = context.measureText(testLine);
          if (metrics.width > 450 && line !== '') {
            context.fillText(line, 256, y);
            line = word + ' ';
            y += 25;
          } else {
            line = testLine;
          }
        });
        context.fillText(line, 256, y);
      }

      const texture = new window.THREE.CanvasTexture(canvas);
      const materials = [
        new window.THREE.MeshPhongMaterial({ color: 0x666666 }), 
        new window.THREE.MeshPhongMaterial({ color: 0x666666 }), 
        new window.THREE.MeshPhongMaterial({ color: 0x666666 }), 
        new window.THREE.MeshPhongMaterial({ color: 0x666666 }), 
        new window.THREE.MeshPhongMaterial({ map: texture }), 
        new window.THREE.MeshPhongMaterial({ color: 0x666666 }), 
      ];

      if (index === 0) {
        const cube = new window.THREE.Mesh(geometry, materials);
        cubeGroup.add(cube);
      }
    });

    scene.add(cubeGroup);

    // Lighting
    const ambientLight = new window.THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new window.THREE.DirectionalLight(0x0EA5E9, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Particle effects around cube
    const particleGeometry = new window.THREE.BufferGeometry();
    const particleCount = 500;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }

    particleGeometry.setAttribute('position', new window.THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new window.THREE.PointsMaterial({
      color: 0xF59E0B,
      size: 0.1,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new window.THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    camera.position.z = 10;
    
    let currentFace = 0;
    let rotationTarget = 0;

    // Auto-rotation and keyboard controls
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        currentFace = (currentFace + 1) % 4;
        rotationTarget = -currentFace * Math.PI / 2;
      } else if (event.key === 'ArrowLeft') {
        currentFace = (currentFace - 1 + 4) % 4;
        rotationTarget = -currentFace * Math.PI / 2;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    // Animation
    const animate = () => {
      // Smooth rotation to target
      cubeGroup.rotation.y += (rotationTarget - cubeGroup.rotation.y) * 0.1;
      
      // Auto-rotate when not actively controlled
      if (Math.abs(rotationTarget - cubeGroup.rotation.y) < 0.01) {
        cubeGroup.rotation.y += 0.005;
        rotationTarget += 0.005;
      }

      // Animate particles
      particles.rotation.y += 0.002;
      
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  };

  return (
    <div className="min-h-screen relative pt-20">
      <FloatingMathSymbols />
      
      <div className="absolute inset-0 z-0">
        <ThreeScene onSceneReady={setupTeamScene} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-space font-bold text-white mb-6">
            Meet Our
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              Expert Team
            </span>
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Passionate educators and technologists dedicated to revolutionizing math education
          </p>
          <p className="text-white/60">
            Use arrow keys to navigate through team members or watch the auto-rotation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
          {teamMembers.map((member, index) => (
            <div key={index} className="glass-panel p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-center">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-2xl font-space font-bold text-white mb-2">{member.name}</h3>
                <p className="text-yellow-400 font-medium mb-4">{member.role}</p>
                <p className="text-white/70">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
