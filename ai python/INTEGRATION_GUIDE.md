# Roulette Engine + Python AI Integration

## ✅ Fixed Issues

1. **Python Error**: `ModuleNotFoundError: No module named 'numpy'`
   - **Solution**: Installed numpy in virtual environment

## 🏗️ Architecture

```
Node.js (Roulette Engine)
│
│  sends state (every 25–50 spins)
│  { history: [...], rtpGap: 0.005 }
▼
Python AI Service (Brain)
│  analyzes patterns using entropy
│  returns bias decisions (JSON)
│  { biasHouse: "first", biasStrength: 1.15, cooldown: false }
▼
Node.js weightedSpin()
   applies bias to weights array
```

## 📁 Files

### 1. `ai_service.py` - Python AI Brain
- Analyzes spin history using entropy calculation
- Returns JSON with bias recommendations
- Reads from stdin, writes to stdout (subprocess-friendly)

### 2. `roulette_integrated.js` - Integrated Engine
- Extends original RouletteEngine
- Calls Python AI every 25-50 spins
- Applies AI decisions to `weightedSpin()`

### 3. `roulette.py` - Original Python logic (deprecated)
- Use `ai_service.py` instead

## 🚀 Usage

### Method 1: Test the Integration
```bash
cd "c:\Users\Dell\python\ai python"
node roulette_integrated.js
```

### Method 2: Use in Your Code
```javascript
const RouletteEngineAI = require('./roulette_integrated.js');

const pythonPath = 'C:/Users/Dell/python/.venv/Scripts/python.exe';
const aiScriptPath = './ai_service.py';

const engine = new RouletteEngineAI([], pythonPath, aiScriptPath);

// Async spin with AI
(async () => {
  for (let i = 0; i < 100; i++) {
    const number = await engine.spinWithAI();
    console.log(`Spin ${i + 1}: ${number}`);
  }
})();
```

### Method 3: Test Python AI Directly
```bash
# Using virtual environment
C:/Users/Dell/python/.venv/Scripts/python.exe ai_service.py

# Then paste JSON input:
{"history": [12, 5, 33, 18, 7, 25, 14, 36, 2, 29, 11, 8], "rtpGap": 0.005}
```

## 🧠 AI Decision Logic

The Python AI uses **entropy** to detect patterns:

- **High Entropy (>0.9)**: Random distribution → Cooldown, no bias
- **Low Entropy (<0.9)**: Pattern detected → Apply bias to dominant dozen

### Example Decisions

```json
{
  "biasHouse": "second",
  "biasStrength": 1.15,
  "cooldown": false,
  "confidence": 85.3,
  "entropy": 0.847
}
```

## 🔧 Configuration

### Change AI Call Frequency
In `roulette_integrated.js`:
```javascript
this.aiCallInterval = 25; // Change to 50 for less frequent calls
```

### Adjust Bias Strength
In `ai_service.py`:
```python
bias_strength = 1.0 + (probs[bias_idx] - 0.33) * 0.5  # Increase multiplier
```

### RTP Sensitivity
In `ai_service.py`:
```python
if rtp_gap < -0.005:  # Change threshold
    bias_strength *= 1.1  # Adjust multiplier
```

## 📊 Output Explained

```
🤖 AI Decision: {
  biasHouse: 'third',        // Bet on numbers 25-36
  biasStrength: 1.15,        // 15% increased weight
  cooldown: false,           // AI is active
  confidence: 73.2,          // 73.2% confidence
  entropy: 0.868             // Pattern strength
}

📊 Applying AI Bias: third (1.15x)
```

## 🛠️ Troubleshooting

### Python not found
Update `pythonPath` in your code:
```javascript
const pythonPath = 'C:/Users/Dell/python/.venv/Scripts/python.exe';
```

### NumPy not installed
```bash
C:/Users/Dell/python/.venv/Scripts/python.exe -m pip install numpy
```

### AI not being called
Check console for `🤖 AI Decision:` messages. Should appear every 25-50 spins.

## 🎯 Next Steps

1. ✅ Integration working
2. ✅ Python AI service operational
3. ✅ Bias decisions applied to weights
4. 🔄 Optional: Add HTTP server for remote AI service
5. 🔄 Optional: Add machine learning model for predictions
