import pyautogui
import keyboard
import logging
import os

def setup_logging():
    # Ensure logs directory exists
    os.makedirs('logs', exist_ok=True)
    logging.basicConfig(
        filename='logs/automation.log',
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )

def start_recording():
    """
    Records keyboard actions until 'esc' is pressed.
    Returns:
        actions (list): List of recorded key names.
    """
    setup_logging()
    actions = []

    def record_action(event):
        actions.append(event.name)
        logging.info(f"Action recorded: {event.name}")

    keyboard.hook(record_action)

    print("Recording... Press 'esc' to stop.")
    keyboard.wait('esc')
    keyboard.unhook(record_action)

    return actions

def save_actions_to_file(actions, filename='actions.txt'):
    """
    Saves recorded actions to a text file.
    Args:
        actions (list): List of recorded key names.
        filename (str): File to save actions.
    """
    with open(filename, 'w') as f:
        for action in actions:
            f.write(f"{action}\n")
    print(f"Actions saved to {filename}")

if __name__ == "__main__":
    recorded_actions = start_recording()
    save_actions_to_file(recorded_actions)
