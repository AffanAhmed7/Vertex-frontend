import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const PlaceholderPage = ({ title, description }: { title: string; description: string }) => (
    <div className="container mx-auto px-6 py-12 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <Card className="max-w-2xl w-full p-12 space-y-6" enableTilt>
            <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight text-foreground uppercase italic underline decoration-primary decoration-4 underline-offset-8">
                    {title}
                </h1>
                <p className="text-muted-foreground text-lg">{description}</p>
            </div>
            <div className="flex gap-4 justify-center pt-4">
                <Button onClick={() => window.history.back()}>Go Back</Button>
                <Button variant="outline" onClick={() => window.location.href = '/'}>Home</Button>
            </div>

            {/* Decorative pulse element */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        </Card>
    </div>
);

export const Home = () => (
    <div className="container mx-auto px-6 pt-12 text-center space-y-12">
        <div className="max-w-4xl mx-auto space-y-6">
            <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-6xl md:text-8xl font-black tracking-tighter text-foreground uppercase leading-none"
            >
                Professional <span className="text-primary italic">Commerce Infrastructure</span>
            </motion.h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Precision-engineered retail solutions for the modern enterprise. Scale your operations with our high-performance architecture.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="rounded-full px-10">Explore Solutions</Button>
                <Button size="lg" variant="outline" className="rounded-full px-10">Request Demo</Button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
            {[1, 2, 3].map((i) => (
                <Card key={i} className="aspect-[3/4] p-8 flex flex-col justify-end text-left group" enableTilt>
                    <div className="space-y-4">
                        <span className="text-xs font-bold text-primary tracking-widest uppercase">Infrastructure Layer {i}</span>
                        <h3 className="text-2xl font-bold italic underline decoration-primary decoration-4 underline-offset-4">Vertex Node {i}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">Enterprise-grade performance metrics for high-volume transactions.</p>
                        <Button variant="ghost" className="p-0 hover:bg-transparent text-primary">Technical Specs &rarr;</Button>
                    </div>
                </Card>
            ))}
        </div>
    </div>
);

export const Shop = () => <PlaceholderPage title="Solutions Directory" description="Explore our catalog of commerce infrastructure modules." />;
export const ProductDetail = () => <PlaceholderPage title="Module Infrastructure" description="Detailed technical specifications and integration roadmap." />;
export const Cart = () => <PlaceholderPage title="Deployment Queue" description="Review your selected modules before system integration." />;
export const Checkout = () => <PlaceholderPage title="Secure Checkout" description="Finalize your partnership through enterprise-grade processing." />;
export const Login = () => <PlaceholderPage title="Systems Access" description="Authenticate to manage your commerce infrastructure." />;
export const Register = () => <PlaceholderPage title="Partner Integration" description="Create an account to join the Vertex global network." />;
export const Account = () => <PlaceholderPage title="Partner Dashboard" description="Manage your commerce modules and operational data." />;
export const Admin = () => <PlaceholderPage title="Vertex Admin" description="Master control interface for marketplace infrastructure." />;
