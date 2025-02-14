from http.server import HTTPServer, SimpleHTTPRequestHandler
import os
import sys
from pathlib import Path

PORT = 8000
DIRECTORY = "build"

class SPAHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Try to serve the file directly
        try:
            super().do_GET()
        except Exception:
            # If file not found, serve index.html for SPA routing
            self.path = '/index.html'
            super().do_GET()

    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def run(port=PORT):
    # Ensure build directory exists
    if not os.path.exists(DIRECTORY):
        print(f"Error: {DIRECTORY} directory not found!")
        print("Please run 'npm run build' first.")
        sys.exit(1)

    # Start server
    server_address = ('', port)
    httpd = HTTPServer(server_address, SPAHandler)
    print(f"Server running on http://localhost:{port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.shutdown()

if __name__ == '__main__':
    if len(sys.argv) > 1:
        run(port=int(sys.argv[1]))
    else:
        run()
