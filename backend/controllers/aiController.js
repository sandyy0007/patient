// Simple rule-based AI symptom checker
const User = require('../models/User');

const symptomChecker = async (req, res, next) => {
  try {
    const { symptoms } = req.body;
    
    const symptomRules = {
      'chest pain|heart|cardiac|palpitations': 'Cardiology',
      'headache|migraine|dizziness|seizure|memory': 'Neurology',
      'skin|rash|allergy|dermat': 'Dermatology',
      'child|kid|pediatric|growth|vaccin': 'Pediatrics',
      'fever|infection|flu|cough|throat': 'General Medicine',
      'diabetes|sugar|thyroid|hormone': 'Endocrinology',
      'bone|joint|back|arthritis|muscle': 'Orthopedics',
      'eye|vision|glasses|blind': 'Ophthalmology',
      'stomach|digest|acid|diarrhea': 'Gastroenterology'
    };

    let recommendedSpecialty = 'General Medicine';
    let confidence = 0;

    for (const [pattern, specialty] of Object.entries(symptomRules)) {
      if (new RegExp(pattern, 'i').test(symptoms)) {
        recommendedSpecialty = specialty;
        confidence = 0.8;
        break;
      }
    }

    // Find matching doctors
    const doctors = await User.find({
      role: 'doctor',
      specialization: recommendedSpecialty,
      isApproved: true
    }).select('-password').sort({ rating: -1 });

    res.json({
      recommendedSpecialty,
      confidence: Math.round(confidence * 100),
      doctors,
      symptomsAnalyzed: symptoms
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { symptomChecker };

