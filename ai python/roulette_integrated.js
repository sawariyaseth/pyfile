// Integrated Roulette Engine with Python AI Service
const { spawn } = require('child_process');
const path = require('path');

class ParentClass {
  spin() {
    console.log("Parent spin method called");
  }
}

class RouletteEngineAI extends ParentClass {
  constructor(history = [
  ], pythonPath = 'python', aiScriptPath = './ai_service.py') {
    super();
    this.history = history.slice(-50);
    this.totalBets = 170451;
    this.virtualPayout = 170451 * 0.94;
    this.targetRTP = 0.94;
    this.smoothedRTP = this.targetRTP;
    
    // AI Integration settings
    this.pythonPath = pythonPath;
    this.aiScriptPath = aiScriptPath;
    this.spinsSinceAICall = 0;
    this.aiCallInterval = 20; // Call AI every 20 spins
    this.currentBias = null;
    this.biasStrength = 1.0;
    this.aiCooldown = false;
  }

  // Query Python AI service
  async queryAI() {
    return new Promise((resolve, reject) => {
      const rtpGap = this.smoothedRTP - this.targetRTP;
      
      const inputData = {
        history: this.history.slice(-50), // Send last 50 spins
        rtpGap: rtpGap
      };

      const pythonProcess = spawn(this.pythonPath, [this.aiScriptPath]);

      let outputData = '';
      let errorData = '';

      pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error('AI Service Error:', errorData);
          resolve({
            biasHouse: null,
            biasStrength: 1.0,
            cooldown: true
          });
        } else {
          try {
            const result = JSON.parse(outputData);
            resolve(result);
          } catch (e) {
            console.error('Failed to parse AI response:', e);
            resolve({
              biasHouse: null,
              biasStrength: 1.0,
              cooldown: true
            });
          }
        }
      });

      pythonProcess.stdin.write(JSON.stringify(inputData));
      pythonProcess.stdin.end();
    });
  }

  async getAIDecision() {
    return this.queryAI();
  }

  // Async spin with AI integration
  async spinWithAI() {
    this.spinsSinceAICall++;

    // Query AI every 25-50 spins (random interval)
    if (this.spinsSinceAICall >= this.aiCallInterval) {
      const aiDecision = await this.queryAI();
      
      console.log('🤖 AI Decision:', aiDecision);
      
      this.currentBias = aiDecision.biasHouse;
      this.biasStrength = aiDecision.biasStrength || 1.0;
      this.aiCooldown = aiDecision.cooldown;
      
      // Keep interval at 20 spins
      this.aiCallInterval = 20;
      this.spinsSinceAICall = 0;
    }

    // Perform the spin
    const number = this.spin();
    return number;
  }

  spin() {
    const BET = 1;
    this.totalBets += BET;
    this.virtualPayout += BET * this.targetRTP;

    // Calculate current RTP
    const totalPayout = this.history.reduce((sum, num) => {
      if (num === 0) return sum;
      const payoutMultiplier = num % 2 === 0 ? 2 : 3;
      return sum + BET * payoutMultiplier;
    }, 0);
    this.currentRTP = totalPayout / this.totalBets;

    this.smoothedRTP = 0.05 * this.currentRTP + 0.95 * this.smoothedRTP;

    const number = this.weightedSpin();
    this.history.push(number);
    if (this.history.length > 50) {
      this.history = this.history.slice(-50);
    }
    return number;
  }

  weightedSpin() {
    let weights = Array(37).fill(1);

    const rtpDiff = this.smoothedRTP - this.targetRTP;

    // RTP adjustment
    if (rtpDiff > 0.005) {
      weights = weights.map(w => w * 0.98);
    } else if (rtpDiff < -0.005) {
      weights = weights.map(w => w * 1.02);
    }

    // ⚡ Apply AI bias decisions
    if (!this.aiCooldown && this.currentBias) {
      console.log(`📊 Applying AI Bias: ${this.currentBias} (${this.biasStrength}x)`);
      
      if (this.currentBias === "first") {
        for (let i = 1; i <= 12; i++) weights[i] *= this.biasStrength;
      }
      if (this.currentBias === "second") {
        for (let i = 13; i <= 24; i++) weights[i] *= this.biasStrength;
      }
      if (this.currentBias === "third") {
        for (let i = 25; i <= 36; i++) weights[i] *= this.biasStrength;
      }
    }

    this.applyStreakControl(weights, this.history);
    this.applyParityBalancing(weights);

    return this.pickWeighted(weights);
  }

  applyStreakControl(weights, history) {
    if (history.length < 3) return;
    const lastThree = history.slice(-3);
    const streak = lastThree.every(num => num === lastThree[0]);
    if (streak) {
      weights[lastThree[0]] *= 0.5;
    }
  }

  applyParityBalancing(weights) {
    const { evenProbability, oddProbability } = this.calculateParityProbabilities();
    if (evenProbability > 0.52)
      for (let i = 2; i <= 36; i += 2) weights[i] *= 0.97;
    if (oddProbability > 0.52)
      for (let i = 1; i <= 35; i += 2) weights[i] *= 0.97;
  }

  pickWeighted(weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
      if (r < weights[i]) return i;
      r -= weights[i];
    }
    return 0;
  }

  calculateParityProbabilities() {
    let evenCount = 0, oddCount = 0, zeroCount = 0;
    for (const number of this.history) {
      if (number === 0) zeroCount++;
      else if (number % 2 === 0) evenCount++;
      else oddCount++;
    }
    const total = evenCount + oddCount + zeroCount || 1;
    return {
      evenProbability: evenCount / total,
      oddProbability: oddCount / total,
      zeroProbability: zeroCount / total
    };
  }

  calculateDozenProbabilities() {
    let first = 0, second = 0, third = 0, zeroCount = 0;
    for (const number of this.history) {
      if (number === 0) zeroCount++;
      else if (number >= 1 && number <= 12) first++;
      else if (number <= 24) second++;
      else if (number <= 36) third++;
    }
    const total = first + second + third + zeroCount || 1;
    return {
      firstProbability: first / total,
      secondProbability: second / total,
      thirdProbability: third / total,
      zeroProbability: zeroCount / total
    };
  }

  summarizeHistory() {
    return {
      spinsAnalyzed: this.history.length,
      parity: this.calculateParityProbabilities(),
      dozens: this.calculateDozenProbabilities()
    };
  }
}

module.exports = RouletteEngineAI;

// Test the integration
if (require.main === module) {
  const pythonPath = 'C:/Users/Dell/python/.venv/Scripts/python.exe';
  const aiScriptPath = path.join(__dirname, 'ai_service.py');
  
  const seedHistory = [36,35,35,24,12,14,1,5,20,1,28,10,14,25,31,29,31,6,31,34,30,19,26,34,27,4,20,35,31,6,18,1,15,16,5,18,0,13,3,15,21,2,31,26,12,5
    
  ];

  const engine = new RouletteEngineAI(seedHistory, pythonPath, aiScriptPath);

  (async () => {
    console.log('🎰 Roulette AI Analysis\n');

    const summary = engine.summarizeHistory();
    console.log('📊 History Summary:', {
      spins: summary.spinsAnalyzed,
      parity: {
        even: (summary.parity.evenProbability * 100).toFixed(1) + '%',
        odd: (summary.parity.oddProbability * 100).toFixed(1) + '%',
        zero: (summary.parity.zeroProbability * 100).toFixed(1) + '%'
      },
      dozens: {
        first: (summary.dozens.firstProbability * 100).toFixed(1) + '%',
        second: (summary.dozens.secondProbability * 100).toFixed(1) + '%',
        third: (summary.dozens.thirdProbability * 100).toFixed(1) + '%',
        zero: (summary.dozens.zeroProbability * 100).toFixed(1) + '%'
      }
    });

    const aiDecision = await engine.getAIDecision();
    console.log('\n🤖 AI Prediction:', aiDecision);
  })();
}
