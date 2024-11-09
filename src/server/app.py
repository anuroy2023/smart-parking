import serial
import time
from flask import Flask, jsonify, request
import threading

app = Flask(__name__)

# Serial communication settings
SERIAL_PORT = '/dev/cu.usbmodem21201'
BAUD_RATE = 9600
SERIAL_TIMEOUT = 1  # seconds

# Initialize serial connection with Arduino
try:
    ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=SERIAL_TIMEOUT)
    time.sleep(2)  # Allow time for Arduino to reset
    ser.flushInput()
    ser.flushOutput()
    print(f"Connected to Arduino on {SERIAL_PORT} at {BAUD_RATE} baud.")
except serial.SerialException as e:
    print(f"Error connecting to Arduino: {e}")
    exit(1)

# Slot management
available_slots = list(range(1, 6))  # Slots 1 to 5
filled_slots = []
slots_count = 5

# Lock for thread-safe operations
slots_lock = threading.Lock()

def read_arduino_slots():
    """
    Continuously reads slot availability from Arduino and updates the available_slots list.
    """
    global available_slots
    while True:
        try:
            if ser.in_waiting > 0:
                line = ser.readline().decode().strip()
                print(f"Arduino says: {line}")

                with slots_lock:
                    if line.startswith("Filled"):
                        slot_number = int(line.split(" - ")[1])
                        if slot_number in available_slots:
                            available_slots.remove(slot_number)
                            filled_slots.append(slot_number)
                    elif line.startswith("Empty"):
                        slot_number = int(line.split(" - ")[1])
                        if slot_number not in available_slots:
                            available_slots.append(slot_number)
                            filled_slots.remove(slot_number)
                            available_slots.sort()
            time.sleep(0.2)  # Adjust as needed
        except Exception as e:
            print(f"Error reading from Arduino: {e}")
            time.sleep(1)  # Wait before retrying

def send_command_to_arduino(command, response_expected=True, response_timeout=2):
    """
    Sends a command to Arduino and optionally waits for a response.

    :param command: The command string to send.
    :param response_expected: Boolean indicating if a response is expected.
    :param response_timeout: Timeout in seconds to wait for the response.
    :return: The response string if expected and received, else None.
    """
    try:
        ser.write(f"{command}\n".encode())
        print(f"Sent to Arduino: {command}")

        if response_expected:
            ser.timeout = response_timeout
            response = ser.readline().decode().strip()
            if response:
                print(f"Received from Arduino: {response}")
                return response
            else:
                print("Error: No response received from Arduino within timeout.")
                return None
        return None
    except serial.SerialException as e:
        print(f"Serial communication error: {e}")
        return None

def get_slot_count():
    """
    Requests the slot count from Arduino.

    :return: Integer slot count or default value (5) on error.
    """
    response = send_command_to_arduino("READ_COUNT")
    if response :
        return int(response)
    else:
        print(f"Invalid slot count received: {response}. Using default value 5.")
        return 5

def get_filled_slots():
    """
    Requests the filled slots from Arduino.

    :return: List of filled slot numbers or default empty list on error.
    """
    response = send_command_to_arduino("AVAILABLE_SLOTS")
    if response:
        try:
            filled = list(map(int, response.split(',')))
            print(f"Filled slots received: {filled}")
            return filled
        except ValueError:
            print(f"Error parsing filled slots: {response}")
    return []

@app.route('/api/slots', methods=['GET'])
def get_slots():
    """
    API endpoint to get the current available slots.
    """
    slot_count = get_slot_count()
    with slots_lock:
        return jsonify({
            'slotCount': get_slot_count()
        })

@app.route('/api/filledSlots', methods=['GET'])
def get_filled_slots_api():
    """
    API endpoint to get the current available slots.
    """
    slot_count = get_slot_count()
    with slots_lock:
        return jsonify({
            'filledSlots': get_filled_slots()
        })

@app.route('/api/book', methods=['GET'])
def book_slot():
    """
    API endpoint to book a specific slot.
    """
    data = request.json
    slot = data.get('slot')

    if not isinstance(slot, int):
        return jsonify({'message': 'Invalid slot number!'}), 400

    with slots_lock:
        if slot in available_slots:
            available_slots.remove(slot)
            filled_slots.append(slot)
            available_slots.sort()
            response = send_command_to_arduino(f"Book{slot}")
            if response:
                return jsonify({
                    'message': f'Slot {slot} booked successfully!',
                    'filledSlots': filled_slots,
                    'availableSlots': available_slots,
                    'slotCount': get_slot_count()
                })
            else:
                # Revert changes if Arduino did not acknowledge
                available_slots.append(slot)
                filled_slots.remove(slot)
                available_slots.sort()
                return jsonify({'message': 'Failed to book slot due to Arduino communication error!'}), 500
        else:
            return jsonify({'message': 'Slot already booked or invalid!'}), 400

@app.route('/api/release', methods=['POST'])
def release_slot():
    """
    API endpoint to release a specific slot.
    """
    data = request.json
    slot = data.get('slot')

    if not isinstance(slot, int):
        return jsonify({'message': 'Invalid slot number!'}), 400

    with slots_lock:
        if slot not in available_slots and 1 <= slot <= 5:
            available_slots.append(slot)
            filled_slots.remove(slot)
            available_slots.sort()
            response = send_command_to_arduino(f"Release{slot}")
            if response:
                return jsonify({
                    'message': f'Slot {slot} released successfully!',
                    'availableSlots': available_slots,
                    'filledSlots': filled_slots,
                    'slotCount': get_slot_count()
                })
            else:
                # Revert changes if Arduino did not acknowledge
                available_slots.remove(slot)
                filled_slots.append(slot)
                available_slots.sort()
                return jsonify({'message': 'Failed to release slot due to Arduino communication error!'}), 500
        else:
            return jsonify({'message': 'Slot already available or invalid!'}), 400

def initialize_app():
    """
    Initializes the Flask app and starts the Arduino reading thread.
    """
    # Start thread to continuously read slot availability from Arduino
    threading.Thread(target=read_arduino_slots, daemon=True).start()
    # Start Flask app
    app.run(debug=True, host="0.0.0.0", port=5000)

if __name__ == '__main__':
    initialize_app()
