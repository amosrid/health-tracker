import React, { useState } from 'react';
import { getWaterRecommendation, getCalorieRecommendation, analyzeFood } from '../../utils/aiService';

const DashboardAI = ({ user }) => {
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleGetWaterRecommendation = async () => {
    setLoading(true);
    try {
      const result = await getWaterRecommendation(
        user.weight || 70, 
        user.activityLevel || 'moderate',
        user.climate || 'temperate'
      );
      setRecommendation(result);
    } catch (error) {
      console.error(error);
      setRecommendation('Error getting recommendation');
    }
    setLoading(false);
  };

  const handleGetCalorieRecommendation = async () => {
    setLoading(true);
    try {
      const result = await getCalorieRecommendation(
        user.weight || 70,
        user.height || 170,
        user.age || 30,
        user.gender || 'male',
        user.activityLevel || 'moderate'
      );
      setRecommendation(result);
    } catch (error) {
      console.error(error);
      setRecommendation('Error getting recommendation');
    }
    setLoading(false);
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleAnalyzeFood = async () => {
    if (!image) {
      setRecommendation('Please upload an image first');
      return;
    }
    
    setLoading(true);
    
    // Convert image to base64
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = async () => {
      try {
        const base64Image = reader.result;
        const result = await analyzeFood(base64Image);
        setRecommendation(result);
      } catch (error) {
        console.error(error);
        setRecommendation('Error analyzing food');
      }
      setLoading(false);
    };
  };

  return (
    <div className="dashboard-ai-container">
      <h3>AI Assistant</h3>
      
      <div className="ai-actions">
        <button onClick={handleGetWaterRecommendation} disabled={loading}>
          Get Water Recommendation
        </button>
        
        <button onClick={handleGetCalorieRecommendation} disabled={loading}>
          Get Calorie Recommendation
        </button>
        
        <div className="food-analysis">
          <h4>Food Analysis</h4>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {imageUrl && (
            <div className="image-preview">
              <img src={imageUrl} alt="Food to analyze" width="200" />
            </div>
          )}
          <button onClick={handleAnalyzeFood} disabled={loading || !image}>
            Analyze Food
          </button>
        </div>
      </div>
      
      {loading && <p>Loading recommendation...</p>}
      
      {recommendation && (
        <div className="ai-recommendation">
          <h4>AI Recommendation</h4>
          <p>{recommendation}</p>
        </div>
      )}
    </div>
  );
};

export default DashboardAI;
