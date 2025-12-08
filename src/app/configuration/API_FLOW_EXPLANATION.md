# Complete API Flow Explanation


##  Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERACTION                         │
│  User types in StepOneForm (project name, APIs, etc.)       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              CLIENT-SIDE (React Components)                 │
│                                                             │
│  1. StepOneForm.tsx                                         │
│     - User types → Local state (useState)                   │
│                                                             │
│  2. User clicks "Save & Continue"                           │
│     - handleContinue() calls saveConfiguration()            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│         CONTEXT METHOD: saveConfiguration()                 │
│         (networkConfigContext.tsx, line 144-178)            │
│                                                             │
│  - Checks: Do we have currentConfigId?                      │
│    • YES → PUT /api/configurations/{id} (update)            │
│    • NO  → POST /api/configurations (create new)            │
│                                                             │
│  - Makes fetch() call to Next.js API route                  │
│    fetch('/api/configurations', { method: 'POST', ... })    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼ HTTP Request (same origin!)
┌─────────────────────────────────────────────────────────────┐
│         NEXT.JS API ROUTE (Server-Side)                     │
│         /app/api/configurations/route.ts                    │
│                                                             │
│  POST handler (line 36-58):                                 │
│  1. Receives request body (JSON)                            │
│  2. Calls connectToDatabase()                               │
│  3. Creates document: NetworkConfigModel.create(body)       │
│  4. Returns JSON: { success: true, data: newConfig }        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              DATABASE CONNECTION                            │
│              /lib/mongodb.ts                                │
│                                                             │
│  connectToDatabase():                                       │
│  - Checks for cached connection (global.mongoose)           │
│  - If not cached, connects to MongoDB using MONGODB_URI     │
│  - Returns mongoose connection                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              MONGOOSE MODEL                                 │
│              /models/NetworkConfig.ts                       │
│                                                             │
│  NetworkConfigModel.create(body):                           │
│  - Validates data against schema                            │
│  - Saves to MongoDB collection                              │
│  - Returns document with _id, createdAt, updatedAt          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    MONGODB DATABASE                         │
│  Document saved with:                                       │
│  {                                                          │
│    _id: ObjectId("..."),                                    │
│    projectName: "...",                                      │
│    readApi: "...",                                          │
│    ingestionApi: "...",                                     │
│    majorTypes: [...],                                       │
│    relationships: [...],                                    │
│    createdAt: Date,                                         │
│    updatedAt: Date                                          │
│  }                                                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼ Response flows back up
┌─────────────────────────────────────────────────────────────┐
│         CONTEXT RECEIVES RESPONSE                           │
│         (networkConfigContext.tsx, line 164-170)            │
│                                                             │
│  - Extracts _id from response.data                          │
│  - Updates currentConfigId state                            │
│  - Saves _id to localStorage                                │
│  - Returns _id to form component                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│         FORM NAVIGATES TO NEXT STEP                         │
│         (StepOneForm.tsx, line 43)                          │
│                                                             │
│  router.push('/configuration/{id}/kind-info')               │
└─────────────────────────────────────────────────────────────┘
```

---

##  Step-by-Step: Creating a New Configuration

### **Step 1: User Starts New Config**
```
URL: /configuration/new/project-info
```

1. **Page loads** (`[id]/project-info/page.tsx`)
   - Checks if `id === 'new'` → doesn't load from DB
   - Renders `StepOneForm`

2. **StepOneForm mounts**
   - Reads from `NetworkConfigContext`
   - Context loads from localStorage (if exists)
   - Form fields populate from context

### **Step 2: User Types Data (Major Types / Relationships follow later)**
```
User types: projectName = "My Project"
```

1. **Local state updates**
   ```typescript
   onChange={(e) => setProjectName(e.target.value))

### **Step 3: User Clicks "Save & Continue"**
```
handleContinue() is called
```

1. **Form calls context method** (StepOneForm.tsx)
   ```typescript
   await saveConfiguration({ readApi, ingestionApi: updateApi, projectName, description });
   ```

2. **Context makes API call** (networkConfigContext.tsx, line 144-178)
   ```typescript
   // Since currentConfigId is null (new config)
   const url = '/api/configurations';  // POST endpoint
   const method = 'POST';
   
   const response = await fetch(url, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(configToSave)
   });
   ```

3. **Next.js API route handles request** (`/app/api/configurations/route.ts`)
   ```typescript
   export async function POST(request: NextRequest) {
     const body = await request.json();  // Parse JSON
     await connectToDatabase();          // Connect to MongoDB
     const newConfig = await NetworkConfigModel.create(body);  // Save to DB
     return NextResponse.json({ success: true, data: newConfig });
   }
   ```

4. **MongoDB saves document**
   - Mongoose validates against schema
   - Document created with `_id`, `createdAt`, `updatedAt`
   - Returns saved document

5. **Response flows back**
   ```typescript
   // Context receives response
   const result = await response.json();
   // result = { success: true, data: { _id: "...", projectName: "...", ... } }
   
   const savedId = result.data._id;  // Extract MongoDB ID
   setCurrentConfigId(savedId);      // Store in context
   localStorage.setItem(CURRENT_CONFIG_ID_KEY, savedId);  // Save to localStorage
   ```

6. **Form navigates to next step**
   ```typescript
   router.push('/configuration/{savedId}/kind-info');
   // Now URL has the real MongoDB ID instead of "new"
   ```

### **Step 4: User Continues to Step 2 (Major Types)**
```
URL: /configuration/{id}/kind-info
```

1. **Page loads** (`[id]/kind-info/page.tsx`)
   - Extracts `id` from URL params
   - Checks if config already loaded in context
   - If not, calls `loadConfiguration(id)`

2. **loadConfiguration()** (networkConfigContext.tsx, line 125-141)
   ```typescript
   const response = await fetch(`/api/configurations/${id}`);
   // GET /api/configurations/{id}
   ```

3. **API route fetches from DB** (`/app/api/configurations/[id]/route.ts`)
   ```typescript
   export async function GET(request, { params }) {
     const { id } = params;
     await connectToDatabase();
     const configuration = await NetworkConfigModel.findById(id);
     return NextResponse.json({ success: true, data: configuration });
   }
   ```

4. **Context updates with fetched data**
   ```typescript
   setConfig(result.data);  // Updates context state
   saveDataToLocalStorage(result.data);  // Also saves to localStorage
   ```

---

### **1. The Context Pattern**

The `NetworkConfigContext` acts as a **state manager**:

```typescript
const { config, saveConfiguration } = useNetworkConfig();

// config = current form data
// saveConfiguration() = method to persist to DB
```

**Why use Context here?**
-  Shared state across all form steps
-  Auto-saves to localStorage (draft persistence)
-  Handles both new and edit modes
-  Centralized API calls

### **2. localStorage as Draft System**

```typescript
// Context saves to localStorage whenever context config changes
//  Context changes on:
// - loadConfiguration(id) after fetching from API
// - saveConfiguration(...) when Save & Continue is clicked
useEffect(() => {
  if (dataLoaded) {
    localStorage.setItem('network-config-data', JSON.stringify(config));
    if (currentConfigId) {
      localStorage.setItem('current-config-id', currentConfigId);
    }
  }
}, [config, currentConfigId, dataLoaded]);
```

**Benefits:**
- User can refresh page without losing data
- Works offline
- Faster than DB (no network call)

**When it syncs to MongoDB:**
- User clicks "Save & Continue" on any step → saves to DB
- User clicks "Save Configuration" on review page → final save

### **5. URL-Based State Management**

```
/configuration/new/project-info        → New config (no ID yet)
/configuration/{id}/project-info       → Editing existing config
/configuration/{id}/kind-info          → Step 2 of config {id}
```

**The `[id]` folder structure:**
- `[id]` is a **dynamic route segment**
- `id` can be `"new"` or a MongoDB ObjectId
- Next.js extracts it from URL: `/configuration/abc123/project-info` → `id = "abc123"`

---

##  Common Patterns in This Project

### **Pattern 1: Form → Context → API → DB**

```typescript
// 1. Form component
const handleSubmit = () => {
  saveConfiguration({ projectName, readApi });
};

// 2. Context method
const saveConfiguration = async (data) => {
  await fetch('/api/configurations', { method: 'POST', body: JSON.stringify(data) });
};

// 3. API route
export async function POST(request) {
  const body = await request.json();
  await NetworkConfigModel.create(body);
}
```

### **Pattern 2: Auto-save to localStorage**

```typescript
// Context watches config changes
useEffect(() => {
  localStorage.setItem('config', JSON.stringify(config));
}, [config]);
```

### **Pattern 3: Load on Mount**

```typescript
// Page component loads config when ID changes
useEffect(() => {
  if (id && id !== 'new') {
    loadConfiguration(id);  // Fetches from API
  }
}, [id]);
```

---

## Summary

1. **User types** → Local state → Context → localStorage (auto-save)
2. **User clicks Save** → Context calls API route → MongoDB saves
3. **Page loads** → Checks localStorage → If editing, fetches from API
4. **All API routes** are server-side code in `/app/api/`
5. **No CORS issues** because client and API are same origin

| Field                                        | React State (TypeScript)            | LocalStorage (JSON)                          | API (JSON)                                   | MongoDB / Mongoose                    |
| -------------------------------------------- | ----------------------------------- | -------------------------------------------- | -------------------------------------------- | ------------------------------------- |
| `readApi`                                    | `string`                            | `string`                                     | `string`                                     | `String` (required)                   |
| `ingestionApi`                               | `string`                            | `string`                                     | `string`                                     | `String` (required)                   |
| `projectName`                                | `string`                            | `string`                                     | `string`                                     | `String` (required)                   |
| `description`                                | `string` | `undefined`              | `string` or missing                          | `string` or missing                          | `String` (optional)                   |
| `majorTypes`                                | `MajorType[]`                       | array of objects                             | array of objects                             | array of subdocuments                 |
| `majorTypes[].id`                           | `string`                            | `string`                                     | `string`                                     | `String` (required)                   |
| `majorTypes[].name`                         | `string`                            | `string`                                     | `string`                                     | `String` (required)                   |
| `majorTypes[].minorTypes`                   | `MinorType[]`                       | array of objects                             | array of objects                             | array of subdocuments                 |
| `majorTypes[].minorTypes[].id`              | `string`                            | `string`                                     | `string`                                     | `String` (required)                   |
| `majorTypes[].minorTypes[].name`            | `string`                            | `string`                                     | `string`                                     | `String` (required)                   |
| `relationships`                              | `Relationship[]`                    | array of objects                             | array of objects                             | array of subdocuments                 |
| `relationships[].id`                         | `string`                            | `string`                                     | `string`                                     | `String` (required)                   |
| `relationships[].name`                       | `string`                            | `string`                                     | `string`                                     | `String` (required)                   |
| `relationships[].connections`                | `Connection[]`                      | array of objects                             | array of objects                             | array of subdocuments                 |
| `relationships[].connections[].id`           | `string`                            | `string`                                     | `string`                                     | `String` (required)                   |
| `relationships[].connections[].from`         | `string`                            | `string`                                     | `string`                                     | `String` (required)                   |
| `relationships[].connections[].to`           | `string`                            | `string`                                     | `string`                                     | `String` (required)                   |
| `relationships[].connections[].direction`    | `'INGOING' \| 'OUTGOING' \| 'BOTH'` | string (`"INGOING"`, `"OUTGOING"`, `"BOTH"`) | string (`"INGOING"`, `"OUTGOING"`, `"BOTH"`) | enum: `['INGOING','OUTGOING','BOTH']` |
| `relationships[].connections[].requiresTime` | `boolean`                           | boolean                                      | boolean                                      | `Boolean` (required)                  |
| `_id`                                        | n/a                                 | n/a                                          | string                                       | `ObjectId` (auto by MongoDB)          |
| `createdAt`                                  | n/a                                 | n/a                                          | string/date                                  | `Date` (auto by Mongoose)             |
| `updatedAt`                                  | n/a                                 | n/a                                          | string/date                                  | `Date` (auto by Mongoose)             |
