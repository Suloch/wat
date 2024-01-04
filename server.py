import asyncio
import websockets
import json

connected_clients = set()

time = 0
async def send_message_all(status, detail, command="", time=0):
    for connection in connected_clients:
        await connection.send(json.dumps({
                        "status": status, 
                        "detail": detail, 
                        "command": command,
                        "time": time
                        }))
                    
# Define a function to handle incoming WebSocket connections
async def handle_websocket_connection(websocket, path):

    # Print a message when a new client connects
    print(f"Client connected from {websocket.remote_address}")
    connected_clients.add(websocket)

    try:
        # Start a loop to continuously listen for messages from the client
        async for message in websocket:
            
            data = json.loads(message)
            if data["command"] == 'connect':
                await websocket.send(json.dumps({"status": "success", "comand": "connect"}))
            
            elif data["command"] == 'play':
                await send_message_all("success", "play", "play", data["time"])

            elif data["command"] == 'pause':
                await send_message_all("success", "pause", "pause", data["time"])

            else:
            # Echo the received message back to the client
                await websocket.send(json.dumps({"status": "fail", "detail": "command not found"}))

    except websockets.exceptions.ConnectionClosedError:
        pass
    
    finally:
        connected_clients.remove(websocket)
    # Print a message when the client disconnects
    print(f"Client disconnected from {websocket.remote_address}")


# Start the WebSocket server
async def start_server():
    server = await websockets.serve(handle_websocket_connection, "0.0.0.0", 8765)

    # Print a message when the server starts
    print("WebSocket server started...")

    # Keep the server running indefinitely
    await server.wait_closed()


# Run the WebSocket server
if __name__ == "__main__":
    asyncio.run(start_server())
