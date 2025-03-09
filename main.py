from openai import OpenAI
import os

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.environ.get("OPENROUTER_API_KEY"),
)

# Ai - 3

messages = [
    {
        "role": "system",
        "content": "You are an experienced chef that helps people by suggesting detailed recipes for dishes they want to cook. You can also provide tips and tricks for cooking and food preparation. You always try to be as clear as possible and provide the best possible recipes for the user's needs. You know a lot about different cuisines and cooking techniques. You are also very patient and understanding with the user's needs and questions."
    }
]

messages.append(
    {
        "role": "system",
        "content": "Your client/contestant is going to provide you with a recipe, and you have to tell them any critiques or improvements that can be made to the recipe. Keep your response concise and to the point. Consider the information to be complete and proceed with the given information/recipe. Just end the conversation after your first response. If there's no further information, just end the conversation."
    }
)

dish = input("Tell me the heck you come up with:\n")
messages.append(
    {
        "role": "user",
        "content": f"What's your thoughts about this {dish}"
    }
)

# Ai - 2

# messages = [
#     {
#         "role": "system",
#         "content": "You are an experienced chef that helps people make a specific dish. You know a lot of cuisines and dishes. You expertise is in quickly recognizing the dish, and the ingredients required to make it."
#     }
# ]

# messages.append(
#     {
#         "role": "system",
#         "content": "Your client is going to name a specific dish with some ingredients and ask you to create the recipe for it. Please provide a fully detailed recipe, with instructions on how can one make it with ease."
#     }
# )

# dish = input("Enter the dish name along with the ingredients:\n")
# messages.append(
#     {
#         "role": "user",
#         "content": f"Please provide me the recipe for {dish}"
#     }
# )

# Ai - 1

# messages = [
#      {
#           "role": "system",
#           "content": "You are an experienced chef that helps people by suggesting dishes they want to cook. You know a lot of cuisines and dishes, you are actually an expert in identifying the ingredients and quickly figure out a dish that could be made from those ingredients.",
#      }
# ]

# messages.append(
#      {
#           "role": "system",
#           "content": "Your client is going to name some ingredients and ask you to suggest a dish that includes those ingredients. Keep your response concise and to the point.",
#      }
# )

# ingredients = input("Enter the ingredients:\n")
# messages.append(
#     {
#         "role": "user",
#         "content": f"Please suggest me a dish which could be made from these {ingredients}"
#     }
# )

model="gpt-4o-mini"

stream=client.chat.completions.create(
    model=model,
    messages=messages,
    stream=True
)

collected_messages = []
for chunk in stream:
    chunk_message = chunk.choices[0].delta.content or ""
    print(chunk_message, end="")
    collected_messages.append(chunk_message)

messages.append({"role": "system", "content": "".join(collected_messages)})

while True:
    print("\n")
    user_input = input()
    messages.append({"role": "user", "content": user_input})
    stream = client.chat.completions.create(
        model=model,
        messages=messages,
        stream=True,
    )
    collected_messages = []
    for chunk in stream:
        chunk_message = chunk.choices[0].delta.content or ""
        print(chunk_message, end="")
        collected_messages.append(chunk_message)

    messages.append({"role": "system", "content": "".join(collected_messages)})