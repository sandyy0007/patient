import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Stethoscope, Clock } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center animate-fade-in relative">
      <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-[100px]" />
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-emerald-400/20 rounded-full blur-[100px]" />
      </div>

      <div className="text-center max-w-4xl mx-auto px-4 mt-16 mb-24">
        <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-800 mb-6 tracking-tight leading-tight">
          Healthcare, <br className="md:hidden" /> Simplified.
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto font-light">
          Connect with elite doctors, manage appointments effortlessly, and stay in control of your medical journey.
        </p>
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Link
            to="/register"
            className="group flex items-center justify-center gap-3 bg-teal-600 text-white px-8 py-4 rounded-full text-lg w-full sm:w-auto font-semibold hover:bg-teal-700 transition-all duration-300 shadow-xl shadow-teal-600/30 hover:shadow-teal-600/50 hover:-translate-y-1"
          >
            Join as Patient
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 bg-white text-teal-700 border-2 border-teal-100 px-8 py-4 rounded-full text-lg w-full sm:w-auto font-semibold hover:border-teal-200 hover:bg-teal-50 transition-all duration-300 shadow-lg shadow-gray-200/50 hover:shadow-gray-300/50"
          >
            Sign In
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        <FeatureCard 
          icon={<Clock className="w-8 h-8 text-white" />}
          title="Instant Scheduling"
          desc="Book appointments intuitively without waiting in long queues. 24/7 availability."
          gradient="from-blue-400 to-indigo-500"
        />
        <FeatureCard 
          icon={<Stethoscope className="w-8 h-8 text-white" />}
          title="Expert Doctors"
          desc="Access top-tier medical professionals categorized by their specialization."
          gradient="from-teal-400 to-emerald-500"
        />
        <FeatureCard 
          icon={<Shield className="w-8 h-8 text-white" />}
          title="Secure Records"
          desc="Your medical history and prescriptions encrypted and safely stored."
          gradient="from-purple-400 to-pink-500"
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, gradient }) => (
  <div className="glass-morphism p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 group">
    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{desc}</p>
  </div>
);

export default Home;
