import numpy as np

def ai_decision(history, rtp_gap):
    last36 = history[-36:]

    first = sum(1 for x in last36 if 1 <= x <= 12)
    second = sum(1 for x in last36 if 13 <= x <= 24)
    third = sum(1 for x in last36 if 25 <= x <= 36)

    probs = np.array([first, second, third]) / max(1, len(last36))
    entropy = -np.sum(probs * np.log(probs + 1e-9))

    if entropy < 0.9:
        bias = np.argmax(probs)
        return {
            "biasHouse": ["first", "second", "third"][bias],
            "biasStrength": 1.1,
            "cooldown": False
        }

    return {
        "biasHouse": None,
        "biasStrength": 1.0,
        "cooldown": True
    }
