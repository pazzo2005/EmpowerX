import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ThreeScene from "@/components/ThreeScene";
import FloatingMathSymbols from "@/components/FloatingMathSymbols";

const About = () => {
  const navigate = useNavigate();

  const contentSections = [
    {
      title: "Our Mission",
      content:
        "At Y2Prove, we believe that mathematics education should be engaging, interactive, and accessible to everyone. Our mission is to revolutionize how students learn math through immersive 3D experiences that make complex concepts intuitive and fun.",
      icon: "🎯",
    },
    {
      title: "Our Vision",
      content:
        "We envision a world where every student can confidently say 'I understand math!' by providing them with visual, interactive learning tools that adapt to their unique learning style and pace.",
      icon: "🔮",
    },
    {
      title: "Our Approach",
      content:
        "By combining cutting-edge 3D technology with proven pedagogical methods, we create learning experiences that engage multiple senses, making mathematical concepts more memorable and meaningful.",
      icon: "🚀",
    },
    {
      title: "Our Impact",
      content:
        "Since our founding, we've helped over 10,000 students improve their math skills, with 85% reporting increased confidence and enjoyment in mathematics learning.",
      icon: "📈",
    },
  ];

  const setupAboutScene = (scene: any, camera: any, renderer: any) => {
    const panels: any[] = [];
    const mathObjects: any[] = [];

    contentSections.forEach((section, index) => {
      const panelGeometry = new window.THREE.PlaneGeometry(4, 2.5);
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = 512;
      canvas.height = 320;

      if (context) {
        const gradient = context.createLinearGradient(0, 0, 0, 320);
        gradient.addColorStop(0, "rgba(14, 165, 233, 0.1)");
        gradient.addColorStop(1, "rgba(30, 64, 175, 0.1)");
        context.fillStyle = gradient;
        context.fillRect(0, 0, 512, 320);

        context.strokeStyle = "rgba(14, 165, 233, 0.5)";
        context.lineWidth = 3;
        context.strokeRect(0, 0, 512, 320);

        context.fillStyle = "#F59E0B";
        context.font = "48px Arial";
        context.textAlign = "center";
        context.fillText(section.icon, 256, 80);

        context.fillStyle = "white";
        context.font = "bold 28px Arial";
        context.fillText(section.title, 256, 130);

        context.font = "16px Arial";
        context.fillStyle = "rgba(255, 255, 255, 0.8)";
        const words = section.content.split(" ").slice(0, 15);
        let line = "";
        let y = 160;

        words.forEach((word, i) => {
          if (i > 0 && i % 5 === 0) {
            context.fillText(line, 256, y);
            line = word + " ";
            y += 20;
          } else {
            line += word + " ";
          }
        });
        if (line) {
          context.fillText(line + "...", 256, y);
        }
      }

      const texture = new window.THREE.CanvasTexture(canvas);
      const material = new window.THREE.MeshPhongMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
      });

      const panel = new window.THREE.Mesh(panelGeometry, material);
      panel.position.set((index - 1.5) * 6, Math.sin(index * 0.5) * 3, -index * 2);

      panels.push(panel);
      scene.add(panel);
    });

    const symbols = ["π", "√", "∑", "∞", "∫", "Δ", "α", "β"];
    const students = ["👨‍🎓", "👩‍🎓", "🧑‍🎓"];

    [...symbols, ...students].forEach((item) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = 128;
      canvas.height = 128;

      if (context) {
        context.fillStyle = students.includes(item) ? "#F59E0B" : "#0EA5E9";
        context.font = "64px Arial";
        context.textAlign = "center";
        context.fillText(item, 64, 80);
      }

      const texture = new window.THREE.CanvasTexture(canvas);
      const material = new window.THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.7,
      });
      const sprite = new window.THREE.Sprite(material);

      sprite.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      sprite.scale.set(1.5, 1.5, 1);

      mathObjects.push({
        mesh: sprite,
        velocity: {
          y: Math.random() * 0.02 + 0.01,
          rotation: Math.random() * 0.02,
        },
      });
      scene.add(sprite);
    });

    const ambientLight = new window.THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new window.THREE.DirectionalLight(0x0ea5e9, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    camera.position.set(0, 0, 15);

    let scrollProgress = 0;
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = Math.min(scrollTop / Math.max(docHeight, 1), 1);
    };

    window.addEventListener("scroll", handleScroll);

    const animate = () => {
      panels.forEach((panel, index) => {
        const targetOpacity = scrollProgress > index * 0.2 ? 1 : 0;
        panel.material.opacity += (targetOpacity - panel.material.opacity) * 0.1;
        panel.rotation.y = Math.sin(Date.now() * 0.001 + index) * 0.1;
        panel.position.y += Math.sin(Date.now() * 0.001 + index * 2) * 0.01;
      });

      mathObjects.forEach((obj) => {
        obj.mesh.position.y += obj.velocity.y;
        obj.mesh.rotation.z += obj.velocity.rotation;

        if (obj.mesh.position.y > 15) {
          obj.mesh.position.y = -15;
          obj.mesh.position.x = (Math.random() - 0.5) * 30;
        }
      });

      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  };

  return (
    <div className="min-h-screen relative pt-20">
      <FloatingMathSymbols />
      <div className="absolute inset-0 z-0">
        <ThreeScene onSceneReady={setupAboutScene} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-space font-bold text-white mb-6">
            About
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              Y2Prove
            </span>
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Revolutionizing mathematics education through immersive 3D learning experiences
          </p>
          <p className="text-white/60">
            Scroll down to reveal our story and see the floating content panels animate
          </p>
        </div>

        <div className="space-y-20">
          {contentSections.map((section, index) => (
            <div
              key={index}
              className="glass-panel p-8 animate-slide-in hover:bg-white/20 transition-all duration-500"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex items-start space-x-6">
                <div className="text-6xl">{section.icon}</div>
                <div>
                  <h2 className="text-3xl font-space font-bold text-white mb-4">
                    {section.title}
                  </h2>
                  <p className="text-lg text-white/80 leading-relaxed">{section.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="glass-panel p-8">
            <h2 className="text-3xl font-space font-bold text-white mb-6">
              Ready to Transform Math Education?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of educators and students who are already experiencing the future of
              learning
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/login")}
                className="neon-button text-white text-lg"
              >
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
