
import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import ThreeScene from "@/components/ThreeScene";
import FloatingMathSymbols from "@/components/FloatingMathSymbols";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userRole, setUserRole] = useState(searchParams.get('role') || 'learner');

  const setupLoginScene = (scene: any, camera: any, renderer: any) => {
    if (!window.THREE) return;

    // Enhanced particle system
    const particleGeometry = new window.THREE.BufferGeometry();
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100;
      positions[i + 1] = (Math.random() - 0.5) * 100;
      positions[i + 2] = (Math.random() - 0.5) * 100;
      
      // Color variations for educational theme
      const color = new window.THREE.Color();
      color.setHSL(0.6 + Math.random() * 0.3, 0.8, 0.6);
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }

    particleGeometry.setAttribute('position', new window.THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new window.THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new window.THREE.PointsMaterial({
      size: 0.8,
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
      blending: window.THREE.AdditiveBlending,
    });

    const particles = new window.THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Floating geometric shapes with education theme
    const shapes = [];
    const geometries = [
      new window.THREE.TetrahedronGeometry(1.5),
      new window.THREE.OctahedronGeometry(1.2),
      new window.THREE.IcosahedronGeometry(1),
      new window.THREE.DodecahedronGeometry(0.8),
    ];

    for (let i = 0; i < 15; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new window.THREE.MeshPhongMaterial({
        color: new window.THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.8, 0.6),
        transparent: true,
        opacity: 0.7,
        emissive: new window.THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.4, 0.1),
      });
      
      const shape = new window.THREE.Mesh(geometry, material);
      shape.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40
      );
      shape.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      shapes.push(shape);
      scene.add(shape);
    }

    // Enhanced lighting system
    const ambientLight = new window.THREE.AmbientLight(0x404060, 0.6);
    scene.add(ambientLight);

    const directionalLight = new window.THREE.DirectionalLight(0x0EA5E9, 1.5);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    const pointLight1 = new window.THREE.PointLight(0xF59E0B, 1, 50);
    pointLight1.position.set(-20, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new window.THREE.PointLight(0x3B82F6, 0.8, 30);
    pointLight2.position.set(20, -10, -10);
    scene.add(pointLight2);

    camera.position.z = 20;

    // Enhanced mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Camera movement based on mouse
      camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Enhanced animation loop
    const animate = () => {
      const time = Date.now() * 0.001;

      // Animate particles
      const positions = particles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += Math.sin(time + positions[i] * 0.01) * 0.02;
        if (positions[i] > 50) positions[i] = -50;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y += 0.002;

      // Animate shapes with more complex motion
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.01 * (index % 3 + 1);
        shape.rotation.y += 0.015 * (index % 2 + 1);
        shape.rotation.z += 0.008 * (index % 4 + 1);
        
        // Floating motion
        shape.position.y += Math.sin(time * 2 + index) * 0.05;
        shape.position.x += Math.cos(time * 1.5 + index) * 0.03;
      });

      // Animate lights
      pointLight1.position.x = Math.sin(time * 0.7) * 25;
      pointLight1.position.y = Math.cos(time * 0.5) * 15;
      
      pointLight2.position.x = Math.cos(time * 0.9) * 20;
      pointLight2.position.z = Math.sin(time * 0.6) * 25;

      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      if (email && password) {
        toast({
          title: "Login Successful!",
          description: `Welcome back to Y2Prove, ${userRole}!`,
        });
        
        switch (userRole) {
          case 'teacher':
            navigate('/team');
            break;
          case 'parent':
            navigate('/contact');
            break;
          default:
            navigate('/');
        }
      } else {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        });
      }
    } else {
      if (name && email && password) {
        toast({
          title: "Account Created!",
          description: `Welcome to Y2Prove, ${name}! Your ${userRole} account is ready.`,
        });
        navigate('/');
      } else {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        });
      }
    }
  };

  const getRoleTitle = () => {
    switch (userRole) {
      case 'teacher':
        return 'Teacher Portal';
      case 'parent':
        return 'Parent Dashboard';
      default:
        return 'Student Learning Hub';
    }
  };

  const getRoleDescription = () => {
    switch (userRole) {
      case 'teacher':
        return isLogin ? 'Access your teaching dashboard and student analytics' : 'Join our innovative teaching community';
      case 'parent':
        return isLogin ? 'Monitor and support your child\'s learning journey' : 'Help guide your child\'s mathematical growth';
      default:
        return isLogin ? 'Continue your immersive math learning adventure' : 'Begin your journey to mathematical mastery';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative pt-20 overflow-hidden">
      <FloatingMathSymbols />
      
      <div className="absolute inset-0 z-0">
        <ThreeScene onSceneReady={setupLoginScene} />
      </div>

      {/* Futuristic grid overlay */}
      <div className="absolute inset-0 z-5 opacity-10">
        <div className="w-full h-full bg-gradient-to-br from-transparent via-blue-500/10 to-transparent">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        <div className="glass-panel p-8 animate-slide-in backdrop-blur-xl bg-white/5 border-2 border-white/20 shadow-2xl">
          {/* Enhanced Role Selector */}
          <div className="mb-8">
            <Label className="text-white text-sm font-medium mb-3 block">Select your role:</Label>
            <div className="grid grid-cols-3 gap-2">
              {['learner', 'teacher', 'parent'].map((role) => (
                <button
                  key={role}
                  onClick={() => setUserRole(role)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    userRole === role
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg shadow-yellow-400/30'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/30'
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/lovable-uploads/ad581c1b-cb17-4239-908e-832272027cb1.png" 
                alt="Y2Prove Logo" 
                className="w-12 h-12 object-contain mr-3"
              />
              <h1 className="text-2xl font-space font-bold text-white">Y2Prove</h1>
            </div>
            <h2 className="text-3xl font-space font-bold text-white mb-2">
              {isLogin ? `Welcome Back` : `Join the Future`}
            </h2>
            <h3 className="text-xl text-yellow-400 mb-2 font-medium">{getRoleTitle()}</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              {getRoleDescription()}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white font-medium">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-panel border-white/30 text-white placeholder-white/50 focus:border-yellow-400 focus:ring-yellow-400 bg-white/5 h-12"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-panel border-white/30 text-white placeholder-white/50 focus:border-yellow-400 focus:ring-yellow-400 bg-white/5 h-12"
                placeholder="Enter your email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-panel border-white/30 text-white placeholder-white/50 focus:border-yellow-400 focus:ring-yellow-400 bg-white/5 h-12"
                placeholder="Enter your password"
              />
            </div>

            <Button type="submit" className="w-full h-12 neon-button text-lg font-semibold">
              {isLogin ? "Sign In to Y2Prove" : "Create Account"}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-white/70 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button variant="outline" className="glass-panel border-white/30 text-white hover:bg-white/20 h-12 bg-white/5">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button variant="outline" className="glass-panel border-white/30 text-white hover:bg-white/20 h-12 bg-white/5">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
            </div>
          </div>

          <div className="mt-8 text-center space-y-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
            >
              {isLogin ? "Don't have an account? Create one now" : "Already have an account? Sign in"}
            </button>
            
            <div>
              <Link to="/" className="text-white/60 hover:text-white transition-colors text-sm font-medium">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
