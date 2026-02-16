import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";
import emailjs from "@emailjs/browser";

// ─── Vertex shader: noise-based sphere morph ──────────────────────────────────
const VERT = `
  uniform float uTime;
  uniform float uMorphStrength;
  uniform float uScrollProgress;
  uniform vec2  uMouse;
  varying vec3  vNormal;
  varying vec3  vPos;
  varying float vNoise;

  vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
  vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.7928429-.8537347*r;}

  float snoise(vec3 v){
    const vec2 C=vec2(1./6.,1./3.);
    const vec4 D=vec4(0.,.5,1.,2.);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
    float n_=.142857142857;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.+1.;
    vec4 s1=floor(b1)*2.+1.;
    vec4 sh=-step(h,vec4(0.));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
    m=m*m;
    return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main(){
    vNormal = normal;
    float t = uTime * 0.38;
    float n1 = snoise(position * 1.2 + t * 0.5);
    float n2 = snoise(position * 2.4 - t * 0.3) * 0.5;
    float n3 = snoise(position * 4.8 + t * 0.7) * 0.25;
    float n  = n1 + n2 + n3;
    vNoise   = n;
    float mouseInfluence = dot(normalize(position), vec3(uMouse.x, uMouse.y, 0.5)) * 0.18;
    float disp = n * uMorphStrength * (1.0 + mouseInfluence);
    disp += uScrollProgress * 0.6 * (n * 0.5 + 0.5);
    vec3 newPos = position + normal * disp;
    vPos = newPos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

// ─── Fragment shader: iridescent liquid metal ─────────────────────────────────
const FRAG = `
  uniform float uTime;
  uniform float uScrollProgress;
  uniform vec3  uColor1;
  uniform vec3  uColor2;
  uniform vec3  uColor3;
  varying vec3  vNormal;
  varying vec3  vPos;
  varying float vNoise;

  void main(){
    vec3 n = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vPos);
    float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 2.8);
    float t = uTime * 0.15;
    float band = sin(vNoise * 4.0 + t) * 0.5 + 0.5;
    vec3 col = mix(uColor1, uColor2, band);
    col = mix(col, uColor3, fresnel * 0.7);
    col = mix(col, vec3(0.9, 1.0, 1.0), uScrollProgress * 0.4);
    vec3 lightDir = normalize(vec3(2.0, 3.0, 2.0));
    float spec = pow(max(dot(reflect(-lightDir, n), viewDir), 0.0), 48.0);
    col += spec * 0.6;
    col += uColor2 * fresnel * 0.8;
    gl_FragColor = vec4(col, 0.92);
  }
`;

// ─── Three.js Scene ───────────────────────────────────────────────────────────
function ContactScene() {
  const mountRef     = useRef(null);
  const scrollRef    = useRef(0);
  const mouseRef     = useRef({ x: 0, y: 0 });
  const targetMouseR = useRef({ x: 0, y: 0 });
  const clickRef     = useRef(false);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = false;
    el.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    const geo = new THREE.IcosahedronGeometry(1.6, 80);
    const mat = new THREE.ShaderMaterial({
      vertexShader:   VERT,
      fragmentShader: FRAG,
      uniforms: {
        uTime:          { value: 0 },
        uMorphStrength: { value: 0.42 },
        uScrollProgress:{ value: 0 },
        uMouse:         { value: new THREE.Vector2(0, 0) },
        uColor1:        { value: new THREE.Vector3(0.0, 0.75, 0.82) },
        uColor2:        { value: new THREE.Vector3(0.0, 0.50, 0.56) },
        uColor3:        { value: new THREE.Vector3(0.9, 1.00, 1.00) },
      },
      transparent: true,
      side: THREE.FrontSide,
    });
    const sphere = new THREE.Mesh(geo, mat);
    scene.add(sphere);

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x1cd8d2, wireframe: true, transparent: true, opacity: 0.05,
    });
    const wireMesh = new THREE.Mesh(geo, wireMat);
    scene.add(wireMesh);

    const rings = [];
    const ringDefs = [
      { r: 2.3,  tube: 0.007, color: 0x1cd8d2, opacity: 0.55, speed:  0.28, tiltX: 0.4, tiltY: 0.0 },
      { r: 2.75, tube: 0.005, color: 0x00bf8f, opacity: 0.40, speed: -0.19, tiltX: 1.1, tiltY: 0.3 },
      { r: 3.2,  tube: 0.004, color: 0x38BDF8, opacity: 0.25, speed:  0.14, tiltX: 0.7, tiltY: 1.2 },
      { r: 3.8,  tube: 0.003, color: 0x1cd8d2, opacity: 0.15, speed: -0.09, tiltX: 1.5, tiltY: 0.6 },
    ];
    ringDefs.forEach(d => {
      const rGeo = new THREE.TorusGeometry(d.r, d.tube, 16, 160);
      const rMat = new THREE.MeshBasicMaterial({ color: d.color, transparent: true, opacity: d.opacity });
      const ring = new THREE.Mesh(rGeo, rMat);
      ring.rotation.x = d.tiltX;
      ring.rotation.y = d.tiltY;
      ring.userData   = { speed: d.speed, baseOpacity: d.opacity };
      scene.add(ring);
      rings.push(ring);
    });

    const orbs = [];
    for (let i = 0; i < 6; i++) {
      const t    = i / 6;
      const oGeo = new THREE.SphereGeometry(0.055, 12, 12);
      const oMat = new THREE.MeshBasicMaterial({ color: t < 0.5 ? 0x1cd8d2 : 0x00bf8f, transparent: true, opacity: 0.9 });
      const orb  = new THREE.Mesh(oGeo, oMat);
      orb.userData = { angle: (i / 6) * Math.PI * 2, radius: 2.3 + Math.random() * 0.4, speed: 0.5 + Math.random() * 0.4, yOffset: (Math.random() - 0.5) * 0.5 };
      scene.add(orb);
      orbs.push(orb);
      const glowMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.13, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x1cd8d2, transparent: true, opacity: 0.12 })
      );
      orb.add(glowMesh);
    }

    const PCOUNT = 2200;
    const pPos   = new Float32Array(PCOUNT * 3);
    const pCol   = new Float32Array(PCOUNT * 3);
    const pBase  = new Float32Array(PCOUNT * 3);
    const pPhase = new Float32Array(PCOUNT);
    for (let i = 0; i < PCOUNT; i++) {
      const r = 2.8 + Math.random() * 4.0;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      pBase[i*3] = pPos[i*3] = x;
      pBase[i*3+1] = pPos[i*3+1] = y;
      pBase[i*3+2] = pPos[i*3+2] = z;
      const mix = Math.random();
      pCol[i*3] = 0.0; pCol[i*3+1] = 0.6 + mix * 0.4; pCol[i*3+2] = 0.5 + mix * 0.5;
      pPhase[i] = Math.random() * Math.PI * 2;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("color",    new THREE.BufferAttribute(pCol, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.022, vertexColors: true, transparent: true, opacity: 0.7, sizeAttenuation: true });
    const pts  = new THREE.Points(pGeo, pMat);
    scene.add(pts);

    const crossGeo   = new THREE.BufferGeometry();
    const crossVerts = new Float32Array([-0.12,0,0, 0.12,0,0, 0,-0.12,0, 0,0.12,0]);
    crossGeo.setAttribute("position", new THREE.BufferAttribute(crossVerts, 3));
    const crossMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0 });
    const cross    = new THREE.LineSegments(crossGeo, crossMat);
    scene.add(cross);

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      targetMouseR.current = {
        x:  ((e.clientX - rect.left) / rect.width  - 0.5) * 2,
        y: -((e.clientY - rect.top)  / rect.height - 0.5) * 2,
      };
    };
    const onLeave  = () => { targetMouseR.current = { x: 0, y: 0 }; };
    const onClick  = () => {
      rings.forEach((r, i) => {
        r.scale.setScalar(1.0);
        const dur = 600 + i * 80;
        const start = performance.now();
        const pulse = () => {
          const p  = Math.min((performance.now() - start) / dur, 1);
          const sc = 1 + Math.sin(p * Math.PI) * 0.35;
          r.scale.setScalar(sc);
          r.material.opacity = r.userData.baseOpacity * (1 + Math.sin(p * Math.PI) * 0.8);
          if (p < 1) requestAnimationFrame(pulse);
          else { r.scale.setScalar(1); r.material.opacity = r.userData.baseOpacity; }
        };
        setTimeout(() => requestAnimationFrame(pulse), i * 40);
      });
    };
    const onScroll = () => {
      const section = el.closest("section") || document.getElementById("contact");
      if (!section) return;
      const rect  = section.getBoundingClientRect();
      const total = section.offsetHeight + window.innerHeight;
      scrollRef.current = Math.max(0, Math.min(1, (-rect.top + window.innerHeight) / total));
    };
    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    let raf;
    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t  = clock.getElapsedTime();
      const sp = scrollRef.current;
      mouseRef.current.x += (targetMouseR.current.x - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (targetMouseR.current.y - mouseRef.current.y) * 0.05;
      mat.uniforms.uTime.value           = t;
      mat.uniforms.uScrollProgress.value = sp;
      mat.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
      const md = Math.sqrt(mouseRef.current.x**2 + mouseRef.current.y**2);
      mat.uniforms.uMorphStrength.value  = 0.42 + md * 0.28 + sp * 0.35;
      sphere.rotation.y = t * 0.12 + mouseRef.current.x * 0.6;
      sphere.rotation.x = t * 0.07 + mouseRef.current.y * 0.4 + sp * 0.8;
      wireMesh.rotation.copy(sphere.rotation);
      const scaleSp = 1.0 + Math.sin(sp * Math.PI) * 0.22;
      sphere.scale.setScalar(scaleSp);
      wireMesh.scale.setScalar(scaleSp);
      rings.forEach((r, i) => {
        r.rotation.z += r.userData.speed * 0.008;
        r.rotation.x  = ringDefs[i].tiltX + mouseRef.current.y * (0.1 + i * 0.04) + sp * (i * 0.3);
        r.rotation.y  = ringDefs[i].tiltY + mouseRef.current.x * (0.08 + i * 0.03);
      });
      orbs.forEach((o) => {
        o.userData.angle += o.userData.speed * 0.012 * (1 + sp * 2);
        const a = o.userData.angle;
        const r = o.userData.radius * (1 + sp * 0.4);
        o.position.set(Math.cos(a) * r, o.userData.yOffset + Math.sin(t * 0.4 + a) * 0.3, Math.sin(a) * r);
        o.material.opacity = 0.9 - sp * 0.6;
      });
      const pos = pGeo.attributes.position.array;
      for (let i = 0; i < PCOUNT; i++) {
        const ph = pPhase[i];
        pos[i*3]   = pBase[i*3]   + Math.sin(t * 0.18 + ph) * 0.06 - mouseRef.current.x * 0.12;
        pos[i*3+1] = pBase[i*3+1] + Math.cos(t * 0.14 + ph) * 0.06 - mouseRef.current.y * 0.12;
        pos[i*3+2] = pBase[i*3+2] + Math.sin(t * 0.22 + ph) * 0.04;
      }
      pGeo.attributes.position.needsUpdate = true;
      pts.rotation.y  = t * 0.018 + sp * 0.5;
      pts.rotation.x  = mouseRef.current.y * 0.08;
      pMat.opacity    = 0.7 - sp * 0.45;
      cross.material.opacity = sp > 0.4 ? (sp - 0.4) * 1.6 * 0.6 : 0;
      cross.scale.setScalar(1.0 + sp * 3);
      cross.rotation.z = t * 0.5;
      camera.position.z = 5.5 + sp * 2.2;
      camera.position.y = Math.sin(t * 0.2) * 0.06 - sp * 0.5;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ position:"absolute", inset:0, cursor:"crosshair" }} />;
}

// ─── Animated input field ──────────────────────────────────────────────────────
function Field({ label, type = "text", name, value, onChange, textarea, required }) {
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;
  return (
    <div className={`ctf-field${focused ? " focused" : ""}${filled ? " filled" : ""}`}>
      <label className="ctf-label">{label}</label>
      {textarea ? (
        <textarea name={name} value={value} onChange={onChange} rows={4}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          required={required} className="ctf-input ctf-textarea" />
      ) : (
        <input type={type} name={name} value={value} onChange={onChange}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          required={required} className="ctf-input" />
      )}
      <span className="ctf-line" />
    </div>
  );
}

// ─── Social links data ────────────────────────────────────────────────────────
const SOCIALS = [
  {
    label: "GitHub",
    href:  "https://github.com/jayOnWeb",
    d: "M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12",
  },
  {
    label: "LinkedIn",
    href:  "https://www.linkedin.com/in/jay-kacha-186722362/", // 👈 replace with your LinkedIn URL
    d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
];

// ─── Main Contact ─────────────────────────────────────────────────────────────
export default function Contact() {
  const [form, setForm]     = useState({ name:"", email:"", subject:"", message:"" });
  const [status, setStatus] = useState("idle");
  const sectionRef          = useRef(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const headingY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const opacity  = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name:  form.name,
          from_email: form.email,
          subject:    form.subject,
          message:    form.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setStatus("sent");
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    }
  };

  const fadeUp = {
    hidden:  { opacity: 0, y: 36 },
    visible: (i) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.75, delay: i * 0.12, ease: [0.16,1,0.3,1] },
    }),
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        #contact {
          font-family: 'DM Sans', sans-serif;
          background: #000;
          position: relative;
          overflow: hidden;
          min-height: 100vh;
        }

        .ct-grid {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(28,216,210,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(28,216,210,0.018) 1px, transparent 1px);
          background-size: 56px 56px;
        }

        .ct-topline {
          position: absolute; top:0; left:0; right:0; height:1px; z-index:20;
          background: linear-gradient(90deg, transparent, rgba(28,216,210,0.35), transparent);
        }

        .ct-three {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
        }
        .ct-three > div { pointer-events: all; }

        .ct-scroll-cue {
          position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);
          z-index: 30; display: flex; flex-direction: column; align-items: center; gap: 6px;
          font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(28,216,210,0.4); font-family: 'DM Sans', sans-serif;
          pointer-events: none;
        }
        .ct-scroll-line {
          width: 1px; height: 36px;
          background: linear-gradient(to bottom, rgba(28,216,210,0.5), transparent);
          animation: ct-dropdwn 1.9s ease-in-out infinite;
        }
        @keyframes ct-dropdwn {
          0%  { transform: scaleY(0); transform-origin: top; opacity:1; }
          50% { transform: scaleY(1); transform-origin: top; opacity:1; }
          100%{ transform: scaleY(1); transform-origin: bottom; opacity:0; }
        }

        .ct-hint {
          position: absolute; bottom: 32px; right: 48px; z-index: 30;
          font-size: 0.58rem; letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(28,216,210,0.3); pointer-events: none;
          animation: ct-pulse-hint 3s ease-in-out infinite;
        }
        @keyframes ct-pulse-hint { 0%,100%{opacity:.3} 50%{opacity:.75} }

        .ct-wrap {
          position: relative; z-index: 10;
          max-width: 1200px; margin: 0 auto;
          padding: 110px 48px 90px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
          min-height: 100vh;
        }
        @media (max-width: 900px) {
          .ct-wrap { grid-template-columns: 1fr; padding: 80px 24px 60px; gap: 48px; }
          .ct-three { display: none; }
        }

        .ct-tag {
          font-size: 0.72rem; font-weight: 500; letter-spacing: 0.22em;
          text-transform: uppercase; color: #1cd8d2;
          display: flex; align-items: center; gap: 10px; margin-bottom: 18px;
        }
        .ct-tag::before { content:''; width:28px; height:1px; background:#1cd8d2; flex-shrink:0; }

        .ct-heading {
          font-family: 'Syne', sans-serif;
          font-size: clamp(3rem, 5.5vw, 5.2rem);
          font-weight: 800; color: #fff;
          line-height: 1; letter-spacing: -0.04em; margin-bottom: 22px;
        }
        .ct-heading .line { display: block; }
        .ct-heading .accent {
          background: linear-gradient(135deg, #00bf8f, #1cd8d2);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .ct-bio {
          font-size: 0.95rem; color: rgba(255,255,255,0.35);
          line-height: 1.8; max-width: 390px; margin-bottom: 36px; font-weight: 300;
        }

        .ct-avail {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 9px 18px; border-radius: 999px;
          border: 1px solid rgba(0,191,143,0.25); background: rgba(0,191,143,0.06);
          margin-bottom: 32px;
        }
        .ct-avail-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #00bf8f; box-shadow: 0 0 8px #00bf8f;
          animation: ct-dot-pulse 2s infinite;
        }
        @keyframes ct-dot-pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.5;transform:scale(.82);} }
        .ct-avail-text {
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: #00bf8f;
        }

        .ct-email-link {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 18px; border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.02);
          text-decoration: none; margin-bottom: 20px;
          transition: border-color .25s, background .25s, transform .25s;
        }
        .ct-email-link:hover { border-color: rgba(28,216,210,0.25); background: rgba(28,216,210,0.04); transform: translateX(4px); }
        .ct-email-icon {
          width:38px; height:38px; border-radius:10px;
          background:rgba(28,216,210,0.08); border:1px solid rgba(28,216,210,0.15);
          display:flex; align-items:center; justify-content:center; color:#1cd8d2; flex-shrink:0;
        }
        .ct-email-lbl { font-size:.6rem; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:rgba(255,255,255,.22); margin-bottom:2px; }
        .ct-email-addr { font-family:'Syne',sans-serif; font-size:.9rem; font-weight:700; color:rgba(255,255,255,.75); transition:color .25s; }
        .ct-email-link:hover .ct-email-addr { color:#fff; }
        .ct-email-arr { margin-left:auto; color:rgba(255,255,255,.15); transition:transform .25s,color .25s; font-size:1rem; }
        .ct-email-link:hover .ct-email-arr { transform:translate(3px,-3px); color:#1cd8d2; }

        .ct-socials { display:flex; gap:8px; }
        .ct-soc {
          width:36px; height:36px; border-radius:10px;
          border:1px solid rgba(255,255,255,.07); background:rgba(255,255,255,.03);
          display:flex; align-items:center; justify-content:center;
          color:rgba(255,255,255,.35); text-decoration:none;
          transition:color .22s,border-color .22s,background .22s,transform .22s;
        }
        .ct-soc:hover { color:#1cd8d2; border-color:rgba(28,216,210,.3); background:rgba(28,216,210,.06); transform:translateY(-3px); }

        .ct-form-shell {
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(4,4,4,0.88);
          backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);
          padding: 38px; position: relative; overflow: hidden;
        }
        .ct-form-shell::before {
          content:''; position:absolute; top:0; left:10%; right:10%; height:1px;
          background:linear-gradient(90deg,transparent,rgba(28,216,210,0.35),transparent);
        }
        .ct-form-glow {
          position:absolute; width:280px; height:280px; border-radius:50%;
          bottom:-30%; right:-15%;
          background:radial-gradient(circle,rgba(28,216,210,0.06),transparent);
          filter:blur(50px); pointer-events:none;
        }
        .ct-form-title {
          font-family:'Syne',sans-serif; font-size:1.22rem; font-weight:800;
          color:#fff; letter-spacing:-0.02em; margin-bottom:4px;
        }
        .ct-form-sub { font-size:.8rem; color:rgba(255,255,255,.28); margin-bottom:28px; }

        .ctf-field { position:relative; margin-bottom:26px; }
        .ctf-label {
          position:absolute; top:0; left:0;
          font-size:.68rem; font-weight:600; letter-spacing:.12em; text-transform:uppercase;
          color:rgba(255,255,255,.22); transition:color .25s; pointer-events:none; user-select:none;
        }
        .ctf-field.focused .ctf-label, .ctf-field.filled .ctf-label { color:#1cd8d2; }
        .ctf-input {
          width:100%; background:transparent; border:none; outline:none;
          padding:22px 0 8px;
          font-family:'DM Sans',sans-serif; font-size:.95rem; color:#fff;
          caret-color:#1cd8d2; resize:none;
        }
        .ctf-input::placeholder { color:transparent; }
        .ctf-textarea { min-height:80px; line-height:1.65; }
        .ctf-line {
          display:block; position:absolute; bottom:0; left:0; right:0; height:1px;
          background:rgba(255,255,255,.08);
        }
        .ctf-line::after {
          content:''; position:absolute; bottom:0; left:50%; right:50%; height:1px;
          background:linear-gradient(90deg,#00bf8f,#1cd8d2);
          transition:left .32s ease,right .32s ease;
        }
        .ctf-field.focused .ctf-line::after { left:0; right:0; }

        .ct-submit {
          position:relative; width:100%; overflow:hidden;
          border-radius:14px;
          border:1px solid rgba(28,216,210,0.28); background:rgba(28,216,210,0.05);
          padding:15px 24px; margin-top:6px;
          font-family:'Syne',sans-serif; font-size:.8rem; font-weight:700;
          letter-spacing:.14em; text-transform:uppercase; color:#fff;
          cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px;
          transition:border-color .3s,box-shadow .3s;
        }
        .ct-submit:hover { border-color:rgba(28,216,210,.65); box-shadow:0 0 32px rgba(28,216,210,.16); }
        .ct-submit:disabled { cursor:not-allowed; opacity:.6; }
        .ct-submit-fill {
          position:absolute; inset:0;
          background:linear-gradient(135deg,#00bf8f,#1cd8d2);
          clip-path:circle(0% at 50% 50%);
          transition:clip-path .52s cubic-bezier(.16,1,.3,1); z-index:0;
        }
        .ct-submit:hover .ct-submit-fill { clip-path:circle(150% at 50% 50%); }
        .ct-submit:hover { color:#000; }
        .ct-submit span { position:relative; z-index:1; }
        .ct-submit-arr { transition:transform .3s; }
        .ct-submit:hover .ct-submit-arr { transform:translateX(4px); }

        .ct-sent { text-align:center; padding:44px 20px; }
        .ct-sent-icon {
          width:62px; height:62px; border-radius:50%;
          background:rgba(0,191,143,.1); border:1px solid rgba(0,191,143,.3);
          display:flex; align-items:center; justify-content:center;
          font-size:1.7rem; margin:0 auto 18px; color:#00bf8f;
        }
        .ct-sent-title { font-family:'Syne',sans-serif; font-size:1.35rem; font-weight:800; color:#fff; margin-bottom:8px; }
        .ct-sent-sub { font-size:.85rem; color:rgba(255,255,255,.32); line-height:1.6; }

        @keyframes ct-spin { to{transform:rotate(360deg);} }
        .ct-spinner {
          width:15px; height:15px; border-radius:50%;
          border:2px solid rgba(255,255,255,.2); border-top-color:#fff;
          animation:ct-spin .7s linear infinite; position:relative; z-index:1;
        }
      `}</style>

      <section id="contact" ref={sectionRef}>
        <div className="ct-grid"/>
        <div className="ct-topline"/>

        <div className="ct-three">
          <ContactScene />
        </div>

        <div className="ct-scroll-cue">
          <div className="ct-scroll-line"/>
          <span>scroll</span>
        </div>
        <div className="ct-hint">click · hover · scroll</div>

        <div className="ct-wrap">

          {/* ── LEFT ── */}
          <motion.div style={{ y: headingY, opacity }}>
            <motion.p className="ct-tag"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}} custom={0}>
              Get In Touch
            </motion.p>

            <motion.h2 className="ct-heading"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}} custom={1}>
              <span className="line">Let's build</span>
              <span className="line"><span className="accent">something</span></span>
              <span className="line">great.</span>
            </motion.h2>

            <motion.p className="ct-bio"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}} custom={2}>
              Open to freelance projects, full-time roles &amp; interesting collaborations.
              If you've got an idea — let's talk.
            </motion.p>

            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}} custom={3}>
              <div className="ct-avail">
                <span className="ct-avail-dot"/>
                <span className="ct-avail-text">Available for work</span>
              </div>
            </motion.div>

            <motion.a
              href="mailto:jaykacha577@gmail.com"
              className="ct-email-link"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}} custom={4}>
              <span className="ct-email-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <div>
                <p className="ct-email-lbl">Email directly</p>
                <p className="ct-email-addr">jaykacha577@gmail.com</p>
              </div>
              <span className="ct-email-arr">↗</span>
            </motion.a>

            {/* ── Socials with real links ── */}
            <motion.div className="ct-socials"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}} custom={5}>
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  className="ct-soc"
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d={s.d}/>
                  </svg>
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: form ── */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}} custom={3}>
            <div className="ct-form-shell">
              <div className="ct-form-glow"/>
              {status === "sent" ? (
                <motion.div className="ct-sent"
                  initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}}
                  transition={{duration:.5,ease:[.16,1,.3,1]}}>
                  <div className="ct-sent-icon">✓</div>
                  <h3 className="ct-sent-title">Message sent!</h3>
                  <p className="ct-sent-sub">Thanks for reaching out — I'll get back to you within 24 hours.</p>
                </motion.div>
              ) : status === "error" ? (
                <div className="ct-sent">
                  <div className="ct-sent-icon" style={{color:"#ff6b6b",borderColor:"rgba(255,107,107,0.3)",background:"rgba(255,107,107,0.08)"}}>✕</div>
                  <h3 className="ct-sent-title">Failed to send</h3>
                  <p className="ct-sent-sub">Something went wrong. Email me directly at jaykacha577@gmail.com</p>
                  <button onClick={() => setStatus("idle")} style={{marginTop:"16px",background:"transparent",border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.5)",padding:"8px 20px",borderRadius:"999px",cursor:"pointer",fontSize:"0.75rem",letterSpacing:"0.1em",fontFamily:"Syne,sans-serif"}}>Try Again</button>
                </div>
              ) : (
                <>
                  <p className="ct-form-title">Send a message</p>
                  <p className="ct-form-sub">Fill out the form and I'll reply as soon as possible.</p>
                  <form onSubmit={handleSubmit}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 20px"}}>
                      <Field label="Your Name" name="name"    value={form.name}    onChange={handleChange} required/>
                      <Field label="Email"     name="email"   value={form.email}   onChange={handleChange} type="email" required/>
                    </div>
                    <Field label="Subject"     name="subject" value={form.subject} onChange={handleChange} required/>
                    <Field label="Message"     name="message" value={form.message} onChange={handleChange} textarea required/>
                    <button type="submit" className="ct-submit" disabled={status==="sending"}>
                      <span className="ct-submit-fill"/>
                      {status==="sending"
                        ? <span className="ct-spinner"/>
                        : <><span>Send Message</span><span className="ct-submit-arr">→</span></>
                      }
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>

        </div>
      </section>
    </>
  );
}