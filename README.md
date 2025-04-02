# Unit Converter Web Application

A modern, responsive web application for converting between different units of measurement. Built with Express.js, TypeScript, and a clean architecture separating frontend and backend concerns.

## Features

-   **Multiple Conversion Types**:

    -   Length (feet, meters, centimeters, inches)
    -   Weight (kilograms, grams, pounds, ounces)
    -   Temperature (Celsius, Fahrenheit, Kelvin)

-   **Modern UI/UX**:

    -   Clean, responsive design
    -   Real-time unit switching
    -   Clear result display
    -   Error handling with user-friendly messages

-   **Architecture**:
    -   RESTful API backend
    -   Client-server separation
    -   TypeScript for type safety
    -   Docker support for easy deployment

## Tech Stack

-   **Backend**:

    -   Node.js
    -   Express.js
    -   TypeScript
    -   dotenv for environment management

-   **Frontend**:

    -   Vanilla JavaScript
    -   Modern CSS3
    -   Responsive Design
    -   Fetch API for HTTP requests

-   **Development**:
    -   Docker for containerization
    -   npm for package management
    -   nodemon for development
    -   TypeScript compiler

## Project Structure

```
├── src/
│   ├── index.ts              # Main application entry
│   ├── routes/
│   │   └── converter.ts      # API route handlers
│   └── services/
│       └── converter.ts      # Conversion business logic
├── public/
│   ├── index.html           # Main HTML file
│   ├── styles.css          # Styles
│   └── script.js           # Frontend JavaScript
├── dist/                   # Compiled TypeScript
├── Dockerfile             # Docker configuration
├── docker-compose.yml    # Docker compose configuration
├── package.json         # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## API Endpoints

### Get Available Units

```http
GET /api/converter/units/:type
```

-   **Parameters**: type (string) - 'length', 'weight', or 'temperature'
-   **Response**: Object containing available units and their display names

### Perform Conversion

```http
POST /api/converter/convert/:type
```

-   **Parameters**: type (string) - 'length', 'weight', or 'temperature'
-   **Body**:
    ```json
    {
      "value": number,
      "fromUnit": string,
      "toUnit": string
    }
    ```
-   **Response**:
    ```json
    {
      "result": number,
      "fromUnit": string,
      "toUnit": string,
      "originalValue": number
    }
    ```

## Setup and Installation

### Local Development

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd unit-converter-web
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a .env file:

    ```env
    PORT=3000
    ```

4. Start development server:
    ```bash
    npm run dev
    ```

### Docker Deployment

1. Build the Docker image:

    ```bash
    docker build -t unit-converter .
    ```

2. Run the container:
    ```bash
    docker run -p 3000:3000 unit-converter
    ```

## Available Scripts

-   `npm run dev`: Start development server with hot-reload
-   `npm run build`: Build TypeScript code
-   `npm start`: Start production server
-   `npm test`: Run tests

## Environment Variables

-   `PORT`: Server port (default: 3000)

## Docker Configuration

The application uses a multi-stage build process:

1. Builder stage: Compiles TypeScript and installs dependencies
2. Production stage: Creates minimal production image

### Docker Image Features:

-   Based on node:22.04-alpine for minimal size
-   Multi-stage build for optimization
-   Production-only dependencies in final image
-   Environment configuration
-   Exposed port 3000

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Error Handling

The application includes comprehensive error handling:

-   Frontend validation for numeric inputs
-   API error responses with meaningful messages
-   Network error handling
-   Type validation

## Security Considerations

-   No sensitive data in client-side code
-   Environment variables for configuration
-   Production dependencies only in Docker
-   Input validation and sanitization

## Browser Support

-   Chrome (latest)
-   Firefox (latest)
-   Safari (latest)
-   Edge (latest)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
