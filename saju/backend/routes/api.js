const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const sajuCalculator = require('../utils/sajuCalculator');
const fiveElementsAnalyzer = require('../utils/fiveElementsAnalyzer');
const sajuInterpreter = require('../utils/sajuInterpreter');

// 데이터 캐시
let dataCache = {
  yearlyFortune: null,
  tojeongData: null
};

// 데이터 로드 함수
async function loadData() {
  try {
    if (!dataCache.yearlyFortune) {
      const yearlyFortunePath = path.join(__dirname, '../data/yearlyFortune.json');
      const yearlyFortuneData = await fs.readFile(yearlyFortunePath, 'utf8');
      dataCache.yearlyFortune = JSON.parse(yearlyFortuneData);
    }

    if (!dataCache.tojeongData) {
      const tojeongDataPath = path.join(__dirname, '../data/tojeongData.json');
      const tojeongData = await fs.readFile(tojeongDataPath, 'utf8');
      dataCache.tojeongData = JSON.parse(tojeongData);
    }

    return {
      yearlyFortune: dataCache.yearlyFortune,
      tojeongData: dataCache.tojeongData
    };
  } catch (error) {
    console.error('데이터 로드 오류:', error);
    throw new Error('운세 데이터를 불러오는데 실패했습니다.');
  }
}

router.post('/calculate', async (req, res) => {
  try {
    const { name, year, month, day, hour, minute } = req.body;
    
    // 사주 계산 로직
    const 사주 = sajuCalculator.calculate사주(year, month, day, hour, minute);
    const 오행분석 = fiveElementsAnalyzer.analyze오행(사주);
    const 해석 = sajuInterpreter.interpret사주(사주, 오행분석);
    
    // 운세 데이터 로드
    const { yearlyFortune, tojeongData } = await loadData();
    
    console.log('API Response Data:', {
      yearlyFortuneExists: !!yearlyFortune,
      tojeongDataExists: !!tojeongData,
      dataPath: path.resolve(__dirname, '../data')
    });

    res.json({
      사주,
      오행분석,
      해석,
      yearlyFortune,
      tojeongData,
      name
    });
  } catch (error) {
    console.error('API 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 