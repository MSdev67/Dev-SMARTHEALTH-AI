'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Activity, FileText } from 'lucide-react';
import { getConsultations, type Consultation } from '../../services/api';
import { format } from 'date-fns';

export default function HistoryPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      const storedUserId = localStorage.getItem('userId') || `user_${Date.now()}`;
      setUserId(storedUserId);
      
      if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', storedUserId);
      }

      try {
        const data = await getConsultations(storedUserId);
        setConsultations(data.consultations);
      } catch (error) {
        console.error('Failed to load consultations');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-orange-100 text-orange-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Consultation History</h1>
        <p className="text-gray-600">View your past symptom analyses and predictions</p>
      </motion.div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Consultations</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{consultations.length}</p>
            </div>
            <FileText className="w-12 h-12 text-primary-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Avg Confidence</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {consultations.length > 0
                  ? (consultations.reduce((sum, c) => sum + c.topConfidence, 0) / consultations.length).toFixed(1)
                  : 0}%
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Recent Activity</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {consultations.length > 0 ? format(new Date(consultations[0].timestamp), 'MMM d') : 'N/A'}
              </p>
            </div>
            <Activity className="w-12 h-12 text-blue-600" />
          </div>
        </motion.div>
      </div>

      {/* Consultation List */}
      {consultations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No consultations yet</h3>
          <p className="text-gray-600 mb-6">Start by checking your symptoms on the home page</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Check Symptoms Now
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {consultations.map((consultation, index) => (
            <motion.div
              key={consultation.consultationId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {format(new Date(consultation.timestamp), 'PPpp')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{consultation.topDisease}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Confidence: {consultation.topConfidence.toFixed(1)}%
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(
                    consultation.predictions[0].severity
                  )}`}
                >
                  {consultation.predictions[0].severity}
                </span>
              </div>

              {/* Symptoms */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Symptoms reported:</p>
                <div className="flex flex-wrap gap-2">
                  {consultation.symptoms.map((symptom, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                    >
                      {symptom.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Top Predictions */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Top predictions:</p>
                <div className="space-y-2">
                  {consultation.predictions.slice(0, 3).map((pred, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">
                        {i + 1}. {pred.disease}
                      </span>
                      <span className="text-gray-500">{pred.confidence.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}