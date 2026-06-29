import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { calculateScores } from '../../utils/scoring';
import { AlertCircle, CheckCircle2, ChevronRight, Mail, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface ResultsProps {
  answers: Record<string, string>;
  onReset: () => void;
}

const Results: React.FC<ResultsProps> = ({ answers, onReset }) => {
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');

  const { totalScore, categoryScores, mainIssueCategory, topProblems } = calculateScores(answers);

  const getScoreStatus = (score: number) => {
    if (score >= 90) return { title: 'Strong Growth Foundation', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 75) return { title: 'Good, But Missing Opportunities', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (score >= 60) return { title: 'Growth Leaks Detected', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (score >= 40) return { title: 'Major Customer Loss Risk', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { title: 'High Risk', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const status = getScoreStatus(totalScore);

  const issueDescriptions: Record<string, { title: string, desc: string }> = {
    visibility: {
      title: 'Main Issue: Low Online Visibility',
      desc: 'Customers may not be finding your business when they search online. Your Google Maps presence, local keywords, service pages, or review activity may be too weak.'
    },
    trust: {
      title: 'Main Issue: Weak Trust Signals',
      desc: 'Customers may see your business online but hesitate to call or book because your website does not show enough proof, details, reviews, or real business information.'
    },
    conversion: {
      title: 'Main Issue: Poor Website Conversion',
      desc: 'People may be visiting your website, but the path to call, book, or contact you is not clear enough, especially on mobile.'
    },
    offer: {
      title: 'Main Issue: Weak Offers or Positioning',
      desc: 'Customers may not see a strong reason to choose your business over nearby competitors. Your website may not clearly show pricing, packages, promotions, or unique benefits.'
    },
    retention: {
      title: 'Main Issue: Weak Customer Retention',
      desc: 'Your business may rely too much on new customers and not enough on bringing past customers back.'
    },
    competition: {
      title: 'Main Issue: Stronger Competitors Online',
      desc: 'Nearby competitors may look more trustworthy, easier to book, or more active online, which can make customers choose them first.'
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            score: totalScore,
            answers,
            topProblems,
            website: answers.website_url,
            businessType: answers.business_type
          }),
        });
        
        if (response.ok) {
          setEmailSubmitted(true);
        } else {
          console.error('Failed to submit lead');
          alert('Failed to submit. Please try again later.');
        }
      } catch (error) {
        console.error('Error submitting lead:', error);
        alert('An error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header & Score */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="overflow-hidden border-none shadow-lg">
            <div className={`p-8 text-center border-b border-slate-100 ${status.bg}`}>
              <h1 className="text-xl font-medium text-slate-600 mb-2">Your Business Growth Score</h1>
              <div className="flex items-end justify-center gap-2 mb-4">
                <span className={`text-6xl font-bold ${status.color}`}>{totalScore}</span>
                <span className="text-2xl text-slate-400 mb-1">/ 100</span>
              </div>
              <h2 className={`text-2xl font-semibold ${status.color}`}>{status.title}</h2>
            </div>
          </Card>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-8">
            {/* Main Diagnosis */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <Card className="border-red-100">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {issueDescriptions[mainIssueCategory]?.title}
                      </h3>
                      <p className="text-slate-600 text-lg leading-relaxed">
                        {issueDescriptions[mainIssueCategory]?.desc}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Problems Found */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <Card>
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-orange-500" /> 
                    Where You May Be Losing Customers
                  </h3>
                  
                  {topProblems.length > 0 ? (
                    <ul className="space-y-4">
                      {topProblems.map((problem, idx) => (
                        <li key={idx} className="flex items-start gap-3 bg-slate-50 p-4 rounded-lg">
                          <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-slate-700 leading-relaxed">{problem}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3 text-green-700">
                      <CheckCircle2 className="w-5 h-5" />
                      We didn't detect any major growth leaks based on your answers!
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar CTA & Module Scores */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <Card className="bg-blue-600 text-white border-none shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Want a Free 5-Point Manual Review?</h3>
                  <p className="text-blue-100 mb-6 text-sm">
                    Enter your website URL and email. We'll send you a simple action plan showing what may be reducing calls, bookings, or repeat customers.
                  </p>
                  
                  {!emailSubmitted ? (
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                      <Input 
                        type="email" 
                        placeholder="Email address" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:ring-white/50"
                      />
                      <Button type="submit" className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold h-11">
                        Get My Free Action Plan
                      </Button>
                    </form>
                  ) : (
                    <div className="bg-white/10 p-4 rounded-lg text-center">
                      <CheckCircle2 className="w-8 h-8 text-white mx-auto mb-2" />
                      <p className="font-medium">Request Received!</p>
                      <p className="text-sm text-blue-100 mt-1">We'll be in touch soon.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-slate-900 mb-4">Category Breakdown</h4>
                  <div className="space-y-3">
                    {[
                      { name: 'Visibility', score: categoryScores.visibility, max: 20 },
                      { name: 'Trust', score: categoryScores.trust, max: 20 },
                      { name: 'Conversion', score: categoryScores.conversion, max: 20 },
                      { name: 'Offer', score: categoryScores.offer, max: 15 },
                      { name: 'Retention', score: categoryScores.retention, max: 15 },
                      { name: 'Competition', score: categoryScores.competition, max: 10 },
                    ].map(cat => (
                      <div key={cat.name} className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">{cat.name}</span>
                        <span className="font-medium text-slate-900">{cat.score} / {cat.max}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

        </div>
        
        <div className="text-center pt-8 pb-4">
          <Button variant="ghost" onClick={onReset} className="text-slate-500">
            Take Diagnostic Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
