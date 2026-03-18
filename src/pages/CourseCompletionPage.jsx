import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Trophy, Download, Home, ArrowRight, Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import confetti from 'canvas-confetti'; // Optional: npm install canvas-confetti

const CourseCompletionPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { currentCourse } = useSelector((state) => state.school);

  useEffect(() => {
    // Trigger confetti on mount for that 'wow' factor
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl shadow-indigo-100 p-12 border border-slate-100 relative overflow-hidden">
        
        {/* Background Decorative Element */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50" />

        <div className="relative z-10 space-y-8">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-100 rounded-full mb-4">
            <Trophy className="w-12 h-12 text-emerald-600" />
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">
              You did it!
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-md mx-auto">
              You've officially completed <span className="text-indigo-600 font-bold">{currentCourse?.title || "the course"}</span>.
            </p>
          </div>

          {/* Progress Summary Card */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col md:flex-row items-center justify-around gap-6">
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
              <p className="text-lg font-bold text-emerald-600">Verified</p>
            </div>
            <div className="h-px w-12 bg-slate-200 hidden md:block" />
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Grade</p>
              <p className="text-lg font-bold text-slate-900">A+</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              className="h-16 rounded-2xl bg-slate-900 text-white font-black text-lg hover:bg-indigo-600 hover:scale-[1.02] transition-all shadow-xl shadow-indigo-100"
              onClick={() => window.print()} // Simple print to PDF hack for now
            >
              <Download className="mr-2 h-5 w-5" />
              Get Certificate
            </Button>
            
            <Button 
              variant="outline"
              className="h-16 rounded-2xl border-2 border-slate-100 font-black text-lg hover:bg-slate-50 transition-all"
              onClick={() => navigate('/dashboard')}
            >
              <Home className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
          </div>

          <div className="pt-6 flex items-center justify-center gap-6">
             <button className="text-slate-400 hover:text-indigo-600 flex items-center gap-2 text-sm font-bold transition-colors">
               <Share2 className="w-4 h-4" /> Share Achievement
             </button>
          </div>
        </div>
      </div>

      <Link to="/courses" className="mt-12 group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-bold">
        Browse more courses <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

export default CourseCompletionPage;