import os
from openai import OpenAI

hf_token = "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"

try:
    print("Testing router...")
    client = OpenAI(base_url="https://router.huggingface.co/hf-inference/v1", api_key=hf_token)
    res = client.chat.completions.create(
        model="Qwen/Qwen2.5-72B-Instruct",
        messages=[{"role": "user", "content": "hi"}],
        max_tokens=10
    )
    print("Router hf-inference Success:", res.choices[0].message.content)
except Exception as e:
    print("Router hf-inference Failed:", e)

try:
    print("\nTesting regular router...")
    client = OpenAI(base_url="https://router.huggingface.co/v1", api_key=hf_token)
    res = client.chat.completions.create(
        model="Qwen/Qwen2.5-72B-Instruct",
        messages=[{"role": "user", "content": "hi"}],
        max_tokens=10
    )
    print("Router v1 Success:", res.choices[0].message.content)
except Exception as e:
    print("Router v1 Failed:", e)
