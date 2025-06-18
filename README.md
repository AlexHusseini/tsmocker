# TSMocker

Generate realistic mock data from TypeScript interfaces.

## Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Build the project:**
```bash
npm run build
```

3. **Generate mock data:**
```bash
npm start -- --schema examples/User.ts --interface User
```

## Usage

```bash
npm start -- --schema <file> --interface <name> [options]
```

### Options
- `--schema, -s` - Path to your TypeScript file
- `--interface, -i` - Name of the interface to mock
- `--count, -c` - Number of objects to generate (default: 1)
- `--output, -o` - Output format: `json` or `csv` (default: json)
- `--out-file, -f` - Save to file instead of console

### Examples

Generate a single user:
```bash
npm start -- --schema examples/User.ts --interface User
```

Generate 5 users and save to file:
```bash
npm start -- --schema examples/User.ts --interface User --count 5 --out-file users.json
```

Generate CSV output:
```bash
npm start -- --schema examples/User.ts --interface SimpleUser --output csv
```

## Supported Types

- ✅ Strings, numbers, booleans
- ✅ Arrays and objects
- ✅ Optional properties (`property?`)
- ✅ Union types (`'a' | 'b'`)
- ✅ Date objects
- ✅ Nested interfaces

## Example Interface

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

## Development

```bash
npm install
npm run build
npm test
``` 