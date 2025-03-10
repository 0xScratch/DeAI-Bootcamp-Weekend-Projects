import os
from openai import OpenAI

# Store your OpenRouter API key in the environment variable OPENROUTER_API_KEY
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.environ.get("OPENROUTER_API_KEY"),
)

# Free models can be accessed from here: https://openrouter.ai/models?max_price=0
model = "deepseek/deepseek-r1:free"

messages = [
    {
        "role": "system",
        "content": (
            "You are a renowned chef and a member of the World Master Chefs Society, known for your expertise in a wide range of international cuisines, including Mediterranean, Asian, European, and more. "
            "You have extensive experience in creating innovative dishes and experimenting with diverse ingredients from around the world. "
            "You are fluent in multiple languages, which helps you connect with various culinary traditions. "
            "You often use phrases like 'Bonjour [Hello, French]', 'Hello [English]', 'Hola [Hello, Spanish]', 'Konnichiwa [Hello, Japanese]', and 'Namaste [Hello, Hindi]' to greet guests warmly. "
            "Your stories are filled with memories of cooking for international guests and exploring global flavors. "
            "You offer thoughtful advice to make each dish perfect, focusing on global techniques and flavors."
        ),
    }
]

messages.append(
    {
        "role": "system",
        "content": (
            "Respond to three specific types of user inputs with particular expertise:\n\n"
            "1. **Ingredient-based dish suggestions**: If a user provides a set of ingredients, suggest the names of a few dishes they could make, drawing from your global culinary expertise. "
            "Your goal is to offer innovative and traditional options, without providing full recipes. Include flavor tips if relevant. End with a warm 'I hope you enjoy these suggestions!'\n\n"
            "2. **Recipe requests for specific dishes**: If the user asks for a recipe for a specific dish, provide a detailed, step-by-step recipe. "
            "Focus on international cooking techniques and traditional methods to make the recipe feel authentic and inviting. "
            "For global classics, include background stories or cultural traditions to enrich the experience.\n\n"
            "3. **Recipe critiques and improvement suggestions**: If the user provides a recipe they've tried, offer gentle and constructive critique. "
            "Suggest tips for improvement, such as adjusting spice blends, cooking times, or ingredient pairings, while staying true to the dish's cultural roots.\n\n"
            "In all responses, interact warmly, like a chef guiding you in the kitchen, helping each user feel the joy of global cuisine. "
        ),
    }
)


def process_request():
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
    return "".join(collected_messages)

def suggest_dish(ingredients):
    messages.append(
        {
            "role": "user",
            "content": f"Suggest a North Indian dish I can make with these ingredients: {', '.join(ingredients)}",
        }
    )
    process_request()

def request_recipe(dish_name):
    messages.append(
        {
            "role": "user",
            "content": f"Provide a detailed recipe for {dish_name}",
        }
    )
    response = process_request()

    with open("recipe.txt", "w", encoding="utf-8") as file:
        file.write(response)

def suggest_critique_and_improvements():
    if os.path.exists("recipe.txt"):
        with open("recipe.txt", "r", encoding="utf-8") as file:
            recipe = file.read()
        messages.append(
            {
                "role": "user",
                "content": f"Please critique and suggest improvements for this recipe: {recipe}",
            }
        )
        process_request()
    else:
        print("Please create a recipe.txt file with the recipe you want to critique and improve Or request a recipe using option 2.")

def main():
    while True:
        print("\nChoose an option:")
        print("1. Suggest a dish based on ingredients")
        print("2. Request a recipe for a specific dish")
        print("3. Provide critique and improvements for a recipe")
        print("4. Exit")

        choice = input("Enter your choice (1/2/3/4): ")

        if choice == '1':
            print()
            ingredients = input("Enter ingredients separated by commas: ").split(',')
            print()
            print("#" * 75 + " MODEL OUTPUT " + "#" * 75 + "\n")
            ingredients = [i.strip() for i in ingredients]
            suggest_dish(ingredients)
            print("\n")
            print("#" * 170 + "\n")
        elif choice == '2':
            print()
            dish_name = input("Enter the name of the dish: ")
            print()
            print("#" * 75 + " MODEL OUTPUT " + "#" * 75 + "\n") 
            request_recipe(dish_name)
            print('\n')
            print('#' * 170 + "\n")
            print()
            print("-" * 100)
            print("Your recipe has been saved in `recipe.txt` file for future reference.")
            print("-" * 100)
        elif choice == '3':
            print()
            print("#" * 75 + " MODEL OUTPUT " + "#" * 75 + "\n")
            suggest_critique_and_improvements()
            print("\n")
            print("#" * 170 + "\n")
            print()
        elif choice == '4':
            break
        else:
            print("Please provide the correct input 🧑‍🍳")

if __name__ == "__main__":
    main()