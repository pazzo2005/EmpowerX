import { useState } from "react";
import ThreeScene from "@/components/ThreeScene";
import FloatingMathSymbols from "@/components/FloatingMathSymbols";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone } from "lucide-react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const setupContactScene = (scene: any, camera: any, renderer: any) => {
    const globeGeometry = new window.THREE.SphereGeometry(3, 32, 32);
    const globeMaterial = new window.THREE.MeshPhongMaterial({
      color: 0x0EA5E9,
      transparent: true,
      opacity: 0.7,
      wireframe: true,
    });
    const globe = new window.THREE.Mesh(globeGeometry, globeMaterial);
    globe.position.set(0, 0, -5);
    scene.add(globe);

    const iconData = [
      { icon: "📧", position: [-4, 2, 0] },
      { icon: "📞", position: [4, 2, 0] },
      { icon: "📍", position: [0, 4, 0] },
    ];

    const iconMeshes: any[] = [];

    iconData.forEach((data, index) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = 128;
      canvas.height = 128;

      if (context) {
        context.fillStyle = "#F59E0B";
        context.font = "64px Arial";
        context.textAlign = "center";
        context.fillText(data.icon, 64, 80);
      }

      const texture = new window.THREE.CanvasTexture(canvas);
      const material = new window.THREE.SpriteMaterial({
        map: texture,
        transparent: true,
      });
      const sprite = new window.THREE.Sprite(material);
      sprite.position.set(...data.position);
      sprite.scale.set(2, 2, 1);

      iconMeshes.push(sprite);
      scene.add(sprite);
    });

    const createParticleExplosion = () => {
      const explosionGeometry = new window.THREE.BufferGeometry();
      const explosionCount = 100;
      const positions = new Float32Array(explosionCount * 3);
      const velocities = [];

      for (let i = 0; i < explosionCount; i++) {
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;

        velocities.push({
          x: (Math.random() - 0.5) * 0.5,
          y: (Math.random() - 0.5) * 0.5,
          z: (Math.random() - 0.5) * 0.5,
        });
      }

      explosionGeometry.setAttribute("position", new window.THREE.BufferAttribute(positions, 3));

      const explosionMaterial = new window.THREE.PointsMaterial({
        color: 0xF59E0B,
        size: 0.2,
        transparent: true,
        opacity: 1,
      });

      const explosion = new window.THREE.Points(explosionGeometry, explosionMaterial);
      scene.add(explosion);

      let time = 0;
      const animateExplosion = () => {
        time += 0.1;
        const positions = explosion.geometry.attributes.position.array;

        for (let i = 0; i < explosionCount; i++) {
          positions[i * 3] += velocities[i].x;
          positions[i * 3 + 1] += velocities[i].y;
          positions[i * 3 + 2] += velocities[i].z;
        }

        explosion.geometry.attributes.position.needsUpdate = true;
        explosionMaterial.opacity -= 0.02;

        if (explosionMaterial.opacity > 0) {
          requestAnimationFrame(animateExplosion);
        } else {
          scene.remove(explosion);
        }
      };
      animateExplosion();
    };

    (window as any).createContactExplosion = createParticleExplosion;

    const ambientLight = new window.THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new window.THREE.DirectionalLight(0x0EA5E9, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    camera.position.z = 10;

    const animate = () => {
      globe.rotation.y += 0.005;
      globe.rotation.x += 0.002;

      iconMeshes.forEach((mesh, index) => {
        mesh.position.y += Math.sin(Date.now() * 0.001 + index) * 0.02;
        mesh.material.rotation += 0.01;
      });

      requestAnimationFrame(animate);
    };
    animate();
  };

  const handleAnimationTrigger = () => {
    if ((window as any).createContactExplosion) {
      (window as any).createContactExplosion();
    }
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen relative pt-20">
      <FloatingMathSymbols />
      <div className="absolute inset-0 z-0">
        <ThreeScene onSceneReady={setupContactScene} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-space font-bold text-white mb-6">
            Get In
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              Touch
            </span>
          </h1>
          <p className="text-xl text-white/80">
            Ready to transform math education? Let's start the conversation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="glass-panel p-6 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Mail className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Email Us</h3>
                  <p className="text-white/70">empowerxmath@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Phone className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Call Us</h3>
                  <p className="text-white/70">+91 86673 12646</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form using FormSubmit */}
          <div className="glass-panel p-8">
            <h2 className="text-2xl font-space font-bold text-white mb-6">Send us a message</h2>

            {showSuccess && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6">
                <p className="text-green-300 font-semibold">Message sent successfully! 🎉</p>
              </div>
            )}

            <form
              action="https://formsubmit.co/gokulv1905cit@gmail.com"
              method="POST"
              onSubmit={handleAnimationTrigger}
              className="space-y-6"
            >
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_next" value="https://yourdomain.com/thank-you" />

              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-panel border-white/30 text-white placeholder-white/50 focus:border-yellow-400 focus:ring-yellow-400"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-panel border-white/30 text-white placeholder-white/50 focus:border-yellow-400 focus:ring-yellow-400"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-white">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="glass-panel border-white/30 text-white placeholder-white/50 focus:border-yellow-400 focus:ring-yellow-400 min-h-[120px]"
                  placeholder="Tell us how we can help you..."
                  required
                />
              </div>

              <Button type="submit" className="w-full neon-button">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
