import json
from ai_service import ai_decision

history = [29,22,19,34,32,9,3,23,28,16,9,20,35,10,17,10,17,10,36,2,19,20,24,2,19,1,7,21,3,23,19,30,8,2,5,5,5,28,33,7,21,12,24,3]
result = ai_decision(history, 0.01)
print(json.dumps(result))
