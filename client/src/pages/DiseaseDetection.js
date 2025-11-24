import React, { useState, useRef } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { analyzeImage } from '../services/aiService';

const DiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    try {
      const analysisResult = await analyzeImage(selectedImage);
      setResult(analysisResult);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">AI Disease Detection</h1>
          <p className="text-indigo-100 text-lg">
            Upload a photo of your crop to instantly identify diseases and get treatment recommendations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card className="h-full">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Image Upload</h3>
          
          {!previewUrl ? (
            <div 
              className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:border-primary-500 hover:bg-slate-50 transition-all cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-6xl mb-4">📸</div>
              <p className="text-lg font-medium text-slate-700 mb-2">
                Drag & Drop or Click to Upload
              </p>
              <p className="text-slate-500 text-sm">
                Supports JPG, PNG (Max 5MB)
              </p>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handleFileSelect}
              />
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-64 md:h-80 object-contain"
              />
              
              {analyzing && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                  <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
                  <p className="text-lg font-medium animate-pulse">Analyzing Crop Health...</p>
                </div>
              )}

              {!analyzing && !result && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur border-t border-slate-200 flex justify-between items-center">
                  <span className="text-sm text-slate-600 truncate max-w-[200px]">
                    {selectedImage?.name}
                  </span>
                  <Button size="sm" variant="ghost" onClick={resetAnalysis}>
                    Remove
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="mt-6">
            <Button 
              className="w-full" 
              disabled={!selectedImage || analyzing || result}
              onClick={handleAnalyze}
            >
              {analyzing ? 'Processing...' : 'Analyze Image'}
            </Button>
          </div>
        </Card>

        {/* Results Section */}
        <div className="space-y-6">
          {result ? (
            <div className="animate-fade-in space-y-6">
              <Card className={`border-l-8 ${result.severity === 'none' ? 'border-l-green-500' : 'border-l-red-500'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Diagnosis</p>
                    <h2 className="text-3xl font-bold text-slate-900">{result.name}</h2>
                  </div>
                  <div className={`px-4 py-2 rounded-full border ${getSeverityColor(result.severity)}`}>
                    <span className="font-bold capitalize">{result.severity === 'none' ? 'Healthy' : result.severity + ' Severity'}</span>
                  </div>
                </div>
                
                <div className="w-full bg-slate-100 rounded-full h-4 mb-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${result.confidence > 0.8 ? 'bg-green-500' : 'bg-yellow-500'}`}
                    style={{ width: `${result.confidence * 100}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm text-slate-500 font-medium">
                  {(result.confidence * 100).toFixed(1)}% Confidence
                </p>
              </Card>

              {result.symptoms.length > 0 && (
                <Card>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="text-xl">🔍</span> Detected Symptoms
                  </h3>
                  <ul className="space-y-2">
                    {result.symptoms.map((symptom, index) => (
                      <li key={index} className="flex items-start gap-3 text-slate-700">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0"></span>
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              <Card>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="text-xl">💊</span> Recommended Treatment
                </h3>
                <ul className="space-y-3">
                  {result.treatment.map((step, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-slate-700">{step}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Button variant="outline" className="w-full" onClick={resetAnalysis}>
                    Analyze Another Image
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-50 border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-4xl">
                🤖
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">AI Analysis Ready</h3>
              <p className="text-slate-500 max-w-xs mx-auto">
                Upload an image to see the AI diagnosis, confidence score, and treatment plan here.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;
