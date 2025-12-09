def replicate_action(action):
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.common.keys import Keys
    import time

    # Initialize the browser (you can customize this to use different browsers)
    driver = webdriver.Chrome()  # Make sure to have the appropriate driver installed

    try:
        for command in action:
            if command['type'] == 'navigate':
                driver.get(command['url'])
                time.sleep(command.get('delay', 1))  # Optional delay

            elif command['type'] == 'click':
                element = driver.find_element(By.XPATH, command['xpath'])
                element.click()
                time.sleep(command.get('delay', 1))  # Optional delay

            elif command['type'] == 'type':
                element = driver.find_element(By.XPATH, command['xpath'])
                element.send_keys(command['text'])
                time.sleep(command.get('delay', 1))  # Optional delay

    finally:
        driver.quit()  # Ensure the browser is closed after actions are completed

# Example usage:
# actions = [
#     {'type': 'navigate', 'url': 'https://example.com'},
#     {'type': 'click', 'xpath': '//*[@id="some-button"]'},
#     {'type': 'type', 'xpath': '//*[@id="some-input"]', 'text': 'Hello World'}
# ]
# replicate_action(actions)