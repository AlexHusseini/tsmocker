# TSMocker

Generate realistic mock data from TypeScript interfaces with an interactive CLI!

## 🚀 Super Easy Interactive Mode

Just run without any options for a guided experience:

```bash
npm install
npm run build
node dist/cli.js
```

**The interactive CLI will:**
- 📁 **Auto-find** all TypeScript files in your project
- 🔧 **Auto-discover** interfaces in selected files  
- 🎮 **Guide you** through options with arrow keys
- 💾 **Smart file naming** with auto-suggestions
- 🎨 **Beautiful colors** and progress indicators

## ⚡ Quick Start (Interactive)

1. **Install dependencies:**
```bash
npm install
```

2. **Build the project:**
```bash
npm run build
```

3. **Run interactive mode:**
```bash
node dist/cli.js
```

4. **Follow the prompts:**
   - Select your TypeScript file ↕️
   - Choose interface to mock ↕️
   - Set number of objects 🔢
   - Pick format (JSON/CSV) 📄
   - Choose file name 📝

## 🖥️ Command Line Mode (Advanced)

For scripts and automation:

```bash
node dist/cli.js --schema <file> --interface <name> [options]
```

### Options
- `--schema, -s` - Path to your TypeScript file
- `--interface, -i` - Name of the interface to mock
- `--count, -c` - Number of objects to generate (default: 1)
- `--output, -o` - Output format: `json` or `csv` (default: json)
- `--out-file, -f` - Save to file

### Examples

```bash
# Interactive mode (easiest)
node dist/cli.js

# Command line mode
node dist/cli.js --schema examples/User.ts --interface User --count 5 --out-file users.json
```

## 🎯 Features

- ✅ **Interactive CLI** - No need to remember commands!
- ✅ **Auto-discovery** - Finds files and interfaces automatically
- ✅ **Smart defaults** - Suggests good file names
- ✅ **Multiple formats** - JSON and CSV output
- ✅ **Realistic data** - Context-aware generation (emails, names, etc.)
- ✅ **Type support** - Strings, numbers, arrays, objects, unions, dates
- ✅ **Beautiful UI** - Colors, emojis, and clear progress

## 🎮 Interactive Demo

```
  _______ _____ __  __            _             
 |__   __/ ____|  \/  |          | |            
    | | | (___ | \  / | ___   ___| | _____ _ __ 
    | |  \___ \| |\/| |/ _ \ / __| |/ / _ \ '__|
    | |  ____) | |  | | (_) | (__|   <  __/ |   
    |_| |_____/|_|  |_|\___/ \___|_|\_\___|_|   

Generate realistic mock data from TypeScript interfaces

? 📁 Select TypeScript file: (Use arrow keys)
❯ examples/User.ts
  examples/TestDate.ts
  examples/GameItem.ts
  src/types.ts

? 🔧 Select interface to mock: (Use arrow keys)
❯ User
  SimpleUser
  Address

? 🔢 How many objects to generate? 5
? 📄 Output format: 📋 JSON (Pretty formatted)
? 💾 Save to file? Yes
? 📝 File name: mock-user.json

🔍 Parsing interface "User" from examples/User.ts...
✅ Found interface with 15 properties
🎲 Generated 5 mock objects
💾 Output written to mock-user.json
   File size: 3.8 KB

🎉 Mock data generated successfully!
```

## 🛠️ Development

```bash
npm install
npm run build
npm test
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