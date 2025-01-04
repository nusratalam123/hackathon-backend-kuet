from transformers import AutoTokenizer, AutoModelForCausalLM
import sys
import json

# Load the model and tokenizer
model_name = "meta-llama/Llama-3.3-70B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name, device_map="auto", load_in_8bit=True)

def generate_response(input_text):
    inputs = tokenizer(input_text, return_tensors="pt")
    outputs = model.generate(**inputs, max_length=100, temperature=0.7)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

if __name__ == "__main__":
    # Parse input from Node.js
    data = json.loads(sys.stdin.read())
    user_input = data.get("input", "")
    response = generate_response(user_input)
    print(json.dumps({"response": response}))
