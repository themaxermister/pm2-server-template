import sys

# Check if enough arguments are passed
if len(sys.argv) < 3:
    print("Usage: python script.py <name> <age> [height]")
    sys.exit(1)

# Get the arguments
name = sys.argv[1]
age = int(sys.argv[2])

# Default height to None
height = sys.argv[3] if len(sys.argv) > 3 else None

# Print the information
print(f"Name: {name}")
print(f"Age: {age}")
if height:
    print(f"Height: {height}")
else:
    print("Height: Not provided")
