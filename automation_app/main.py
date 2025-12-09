import argparse
import logging
from scripts.recorder import start_recording, stop_recording
from scripts.player import play_actions

def setup_logging():
    logging.basicConfig(
        filename='logs/automation.log',
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )

def main():
    setup_logging()
    parser = argparse.ArgumentParser(description='Automation Application')
    parser.add_argument('--command', type=str, required=True, help='Command to execute: track or play')
    
    args = parser.parse_args()

    if args.command == 'track':
        logging.info('Starting recording...')
        start_recording()
    elif args.command == 'play':
        logging.info('Playing recorded actions...')
        play_actions()
    else:
        logging.error('Invalid command provided.')
        print("Invalid command. Use 'track' to record actions or 'play' to replicate them.")

if __name__ == '__main__':
    main()