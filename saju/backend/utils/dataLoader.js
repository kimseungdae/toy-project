const fs = require('fs').promises;
const path = require('path');

async function loadCelestialStems() {
  try {
    const filePath = path.join(__dirname, '../data/celestialStems.json');
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('천간 데이터 로드 실패:', error);
    throw new Error('천간 데이터를 불러오는데 실패했습니다.');
  }
}

async function loadEarthlyBranches() {
  try {
    const filePath = path.join(__dirname, '../data/earthlyBranches.json');
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('지지 데이터 로드 실패:', error);
    throw new Error('지지 데이터를 불러오는데 실패했습니다.');
  }
}

async function loadFiveElements() {
  try {
    const filePath = path.join(__dirname, '../data/fiveElements.json');
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('오행 데이터 로드 실패:', error);
    throw new Error('오행 데이터를 불러오는데 실패했습니다.');
  }
}

async function loadInterpretation() {
  try {
    const filePath = path.join(__dirname, '../data/interpretation.json');
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('해석 데이터 로드 실패:', error);
    throw new Error('해석 데이터를 불러오는데 실패했습니다.');
  }
}

async function loadTojeongData() {
  try {
    const filePath = path.join(__dirname, '../data/tojeongData.json');
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('토정비결 데이터 로드 실패:', error);
    throw new Error('토정비결 데이터를 불러오는데 실패했습니다.');
  }
}

async function loadYearlyFortune() {
  try {
    const filePath = path.join(__dirname, '../data/yearlyFortune.json');
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('연간 운세 데이터 로드 실패:', error);
    throw new Error('연간 운세 데이터를 불러오는데 실패했습니다.');
  }
}

module.exports = {
  loadCelestialStems,
  loadEarthlyBranches,
  loadFiveElements,
  loadInterpretation,
  loadTojeongData,
  loadYearlyFortune
}; 