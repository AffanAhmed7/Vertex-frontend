import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, ContactShadows } from '@react-three/drei';

interface SceneCanvasProps {
    children?: React.ReactNode;
    enableControls?: boolean;
}

const SceneCanvas: React.FC<SceneCanvasProps> = ({ children, enableControls = false }) => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas
                shadows
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]} // Performance optimization
            >
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

                {/* Cinematic Lighting */}
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <Suspense fallback={null}>
                    <Environment preset="city" />

                    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                        {children || (
                            /* Temporary placeholder 3D object: A floating torus */
                            <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
                                <torusGeometry args={[1, 0.4, 32, 100]} />
                                <meshStandardMaterial
                                    color="hsl(160, 84%, 39%)"
                                    roughness={0.1}
                                    metalness={0.8}
                                    emissive="hsl(160, 84%, 20%)"
                                />
                            </mesh>
                        )}
                    </Float>

                    <ContactShadows
                        position={[0, -2, 0]}
                        opacity={0.4}
                        scale={10}
                        blur={2}
                        far={4.5}
                    />
                </Suspense>

                {enableControls && <OrbitControls enableZoom={false} enablePan={false} />}
            </Canvas>

            {/* Background vignette */}
            <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
        </div>
    );
};

export default SceneCanvas;
