import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, PlayCircle, Lock, Loader2, Globe, ShieldCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import API from '../../api/axiosConfig'; 

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await API.get(`/courses/${id}/`);
        setCourse(res.data);
      } catch {
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (course.is_enrolled) {
      navigate(`/dashboard/courses/${id}`);
      return;
    }
    setPaying(true);
    try {
      const res = await API.post(`/courses/${id}/initialize-paystack/`);
      
      if (res.data.link) {
        window.location.href = res.data.link;
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Payment system unavailable. Try again later.";
      toast.error(errorMsg);
    } finally {
      setPaying(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin h-10 w-10 text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold">
              {course.category || 'Tech Specialization'}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              {course.title}
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-lg">
              {course.description || "Master industry-standard skills with hands-on projects and expert mentorship."}
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-2"><Globe size={18}/> English / Swahili</span>
              <span className="flex items-center gap-2"><PlayCircle size={18}/> 12+ Modules</span>
            </div>
          </div>
          
          {/* Pricing Card */}
          <Card className="border-none shadow-2xl overflow-hidden">
            <div className="aspect-video bg-slate-800 flex items-center justify-center relative">
               <img src={course.image || '/placeholder-course.jpg'} alt="Preview" className="object-cover w-full h-full opacity-60" />
               <PlayCircle className="absolute text-white h-16 w-16 opacity-80 cursor-pointer hover:scale-110 transition" />
            </div>
            <CardContent className="p-8 bg-white">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-black text-slate-900">KES {course.price}</span>
                <span className="text-slate-500 line-through">KES {Math.round(course.price * 1.5)}</span>
              </div>
              
              <Button 
                onClick={handleEnroll} 
                disabled={paying}
                className={`w-full h-14 text-lg font-bold mb-4 ${
                  course.is_enrolled 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "bg-amber-500 text-slate-900 hover:bg-amber-600"
                }`}
              >
                {paying ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : course.is_enrolled ? (
                  <PlayCircle className="mr-2 h-5 w-5" />
                ) : (
                  <Lock className="mr-2 h-5 w-5" />
                )}
                
                {course.is_enrolled ? "Continue Learning" : "Enroll Now & Start Learning"}
              </Button>
              
              <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1">
                <ShieldCheck size={14} className="text-green-600" /> 
                Secure Payment via PayStack (M-Pesa Cards & Apple Pay)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold mb-8 text-slate-900">What you'll learn</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-16">
            {['DevSecOps Integration', 'Cloud Architecture', 'Secure API Design', 'Scaling Apps'].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle className="text-amber-500 mt-1 flex-shrink-0" size={20} />
                <span className="text-slate-700">{item}</span>
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-bold mb-6 text-slate-900">Curriculum</h2>
          <div className="space-y-4">
            {course.syllabus?.map((module, idx) => (
              <div key={idx} className="p-4 border rounded-lg flex justify-between items-center hover:bg-slate-50 transition">
                <span className="font-medium text-slate-800">{idx + 1}. {module.title}</span>
                <Lock size={16} className="text-slate-400" />
              </div>
            )) || <p className="text-slate-500 italic">Syllabus details coming soon...</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;