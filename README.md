# TSMocker

Generate realistic mock data from TypeScript interfaces with an interactive CLI.

## Quick Start

```bash
npm install
npm run build
npm start
```

## Usage

### Interactive Mode (Recommended)
```bash
npm start
```
- 📁 Auto-discovers TypeScript files
- 🔧 Auto-detects interfaces  
- 🎮 Guided experience with arrow key navigation
- 💾 Smart file naming suggestions

### Command Line Mode
```bash
npm start -- --schema <file> --interface <name> [options]
```

**Options:**
- `--schema, -s` - Path to TypeScript file
- `--interface, -i` - Interface name to mock
- `--count, -c` - Number of objects (default: 1)
- `--output, -o` - Format: `json` or `csv` (default: json)
- `--out-file, -f` - Save to file

**Examples:**
```bash
# Generate 5 users as JSON
npm start -- --schema examples/User.ts --interface User --count 5

# Generate CSV and save to file
npm start -- --schema examples/User.ts --interface User --output csv --out-file users.csv
```

## Features

- ✅ Interactive CLI with auto-discovery
- ✅ Realistic data generation (context-aware)
- ✅ Multiple output formats (JSON, CSV)
- ✅ Full TypeScript support (unions, arrays, objects, dates)
- ✅ Optional properties and nested interfaces

## Supported Types

- Primitives: `string`, `number`, `boolean`, `Date`
- Collections: `array[]`, `object`
- Advanced: `union types`, `optional properties`, `nested interfaces`

## Example

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  role: 'admin' | 'user';
  address?: {
    street: string;
    city: string;
  };
}
```

Generates realistic data like:
```json
{
  "id": 1234,
  "name": "John Doe", 
  "email": "john.doe@example.com",
  "isActive": true,
  "role": "user",
  "address": {
    "street": "123 Main St",
    "city": "Springfield"
  }
}
```

## Development

```bash
npm test    # Run tests
npm run build    # Build project
``` 