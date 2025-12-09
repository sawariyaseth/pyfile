# Automation Application

This project is an automation application designed to monitor user actions and replicate them in a web browser. It utilizes various libraries to capture user input and perform automated tasks based on recorded actions.

## Project Structure

```
automation_app
├── scripts
│   ├── recorder.py      # Captures user actions
│   └── player.py        # Replicates actions in a browser
├── config
│   └── settings.yaml    # Configuration settings
├── logs
│   └── automation.log    # Logs application activity
├── main.py              # Entry point of the application
├── requirements.txt      # Required Python libraries
└── README.md            # Project documentation
```

## Installation

To install the necessary dependencies, run the following command:

```
pip install -r requirements.txt
```

## Usage

To run the application, use the following command format:

```
python main.py --command "<command>"
```

### Example Commands

- To start tracking user actions:
  ```
  python main.py --command "track"
  ```

- To replay recorded actions:
  ```
  python main.py --command "play"
  ```

## Contributing

Feel free to contribute to this project by submitting issues or pull requests. Your feedback and contributions are welcome!

## License

This project is licensed under the MIT License. See the LICENSE file for more details.