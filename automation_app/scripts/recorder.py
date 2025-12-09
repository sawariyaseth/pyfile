def start_recording():
    import pyautogui
    import keyboard
    import logging

    logging.basicConfig(filename='logs/automation.log', level=logging.INFO)

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
    with open(filename, 'w') as f:
        for action in actions:
            f.write(f"{action}\n")
    print(f"Actions saved to {filename}")

if __name__ == "__main__":
    recorded_actions = start_recording()
    save_actions_to_file(recorded_actions)