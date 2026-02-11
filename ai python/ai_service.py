"""
AI Service for Roulette Engine
Provides bias predictions based on spin history and RTP gap
"""
import sys
import json
import numpy as np

def ai_decision(history, rtp_gap):
    """
    Analyzes roulette history and returns betting bias recommendations
    
    Args:
        history: List of recent spin results (numbers 0-36)
        rtp_gap: Difference between current and target RTP
    
    Returns:
        dict with biasHouse, biasStrength, and cooldown
    """
    if len(history) < 12:
        return {
            "biasHouse": None,
            "biasStrength": 1.0,
            "cooldown": True,
            "confidence": 0.0
        }
    
    # Analyze last 36 spins (or all available if less)
    last36 = history[-36:]
    
    # Count occurrences in each dozen
    first = sum(1 for x in last36 if 1 <= x <= 12)
    second = sum(1 for x in last36 if 13 <= x <= 24)
    third = sum(1 for x in last36 if 25 <= x <= 36)
    
    # Calculate probabilities
    total = max(1, len(last36))
    probs = np.array([first, second, third]) / total
    
    # Calculate entropy (measure of randomness)
    entropy = -np.sum(probs * np.log(probs + 1e-9))
    
    # Always return the house with highest probability
    bias_idx = np.argmax(probs)
    bias_house = ["first", "second", "third"][bias_idx]
    
    # If entropy is low, there's a strong pattern
    if entropy < 0.9:
        bias_strength = 1.0 + (probs[bias_idx] - 0.33) * 0.5  # Scale strength
        cooldown = False
    else:
        # Even with high entropy, still pick the highest but with lower strength
        bias_strength = 1.0 + (probs[bias_idx] - 0.33) * 0.3  # Weaker strength
        cooldown = False  # Never cooldown, always apply bias
    
    # Adjust for RTP gap
    if rtp_gap < -0.005:  # Casino losing money
        bias_strength *= 1.1  # Increase bias to favor house
    
    return {
        "biasHouse": bias_house,
        "biasStrength": round(bias_strength, 3),
        "cooldown": cooldown,
        "confidence": round((1.1 - entropy) * 100, 1) if entropy < 0.9 else round((probs[bias_idx] - 0.33) * 100, 1),
        "entropy": round(entropy, 3)
    }


def main():
    """
    Main entry point for subprocess communication
    Reads JSON from stdin, returns JSON to stdout
    """
    try:
        # Read input from stdin
        input_data = json.loads(sys.stdin.read())
        
        history = input_data.get("history", [])
        rtp_gap = input_data.get("rtpGap", 0.0)
        
        # Get AI decision
        result = ai_decision(history, rtp_gap)
        
        # Output result as JSON
        print(json.dumps(result))
        sys.exit(0)
        
    except Exception as e:
        error_result = {
            "error": str(e),
            "biasHouse": None,
            "biasStrength": 1.0,
            "cooldown": True
        }
        print(json.dumps(error_result))
        sys.exit(1)


if __name__ == "__main__":
    main()
