# TSMocker

A powerful TypeScript-based CLI tool for generating realistic mock data from TypeScript interfaces. TSMocker automatically analyzes your TypeScript interfaces and generates appropriate mock data that matches the type structure.

## Features

- 🎯 Parse TypeScript interfaces and generate realistic mock data
- 🔄 Support for nested objects and arrays
- 📦 Handles various types:
  - Primitive types (string, number, boolean)
  - Complex types (arrays, objects, unions)
  - Date objects
  - Optional properties
- 📊 Multiple output formats:
  - JSON
  - CSV
- 🎨 Smart data generation:
  - Context-aware string generation (emails, names, addresses, etc.)
  - Realistic number ranges
  - Appropriate date formats
  - Nested object structures
- 🔧 Customizable number of mock objects
- 📝 File output support

## Installation

### Global Installation

```bash
npm install -g tsmocker
```

### Local Installation

```bash
npm install --save-dev tsmocker
```

## Usage

### Basic Usage

```bash
tsmocker --schema <path-to-file> --interface <interface-name>
```

### Command Line Options

- `--schema, -s` (required): Path to TypeScript file containing interfaces
- `--interface, -i` (required): Name of the interface to mock
- `--count, -c` (optional): Number of mock objects to generate (default: 1)
- `--output, -o` (optional): Output format (json or csv) (default: json)
- `--out-file, -f` (optional): Output file path (if not specified, prints to stdout)

### Examples

1. Generate a single User object in JSON format:
```bash
tsmocker --schema examples/User.ts --interface User
```

2. Generate 5 User objects in JSON format:
```bash
tsmocker --schema examples/User.ts --interface User --count 5 --output json
```

3. Generate 10 SimpleUser objects in CSV format and save to a file:
```bash
tsmocker --schema examples/User.ts --interface SimpleUser --count 10 --output csv --out-file users.csv
```

## Example Interface

Here's an example of a TypeScript interface that TSMocker can handle:

```typescript
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  isActive: boolean;
  birthDate: Date;
  role: 'admin' | 'user' | 'guest';
  lastLogin?: Date;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  phoneNumbers: string[];
  tags: string[];
  socialProfiles?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  settings: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    language: string;
  };
  metadata: Record<string, any>;
}
```

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tsmocker.git
cd tsmocker
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Run tests:
```bash
npm test
```

### Project Structure

```
tsmocker/
├── src/
│   ├── cli.ts         # CLI entry point
│   ├── parser.ts      # TypeScript interface parser
│   ├── generator.ts   # Mock data generator
│   └── types.ts       # Shared type definitions
├── examples/
│   └── User.ts        # Example interfaces
├── __tests__/
│   ├── parser.test.ts
│   └── generator.test.ts
├── package.json
├── tsconfig.json
└── README.md
```

### Available Scripts

- `npm run build` - Build the project
- `npm start` - Run the CLI tool
- `npm run dev` - Run in development mode
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run prettier` - Format code with Prettier

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- [@faker-js/faker](https://github.com/faker-js/faker) for realistic data generation
- [ts-morph](https://github.com/dsherret/ts-morph) for TypeScript parsing
- [commander](https://github.com/tj/commander.js) for CLI argument parsing 