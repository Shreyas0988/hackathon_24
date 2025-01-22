
import base64
from openai import OpenAI

client = OpenAI(api_key="sorry but cant show mb :(")

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


image_path = input("Enter an image path: ")

base64_image = encode_image(image_path)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "system",
            "content": "You are an extremely talented mathematician who is also great at tutoring students. The user is one such student"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Solve this math problem",
                },
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                },
            ],
        }
    ],
)

print(response.choices[0])
print("---------")
print(response.choices[0].message.content)