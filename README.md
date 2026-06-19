#  Virtual CD Try-On System
### Final Year College Project — Full Stack + AI

A 3D virtual clothing try-on system with AI outfit recommendations powered by color theory.

---

## Architecture

```
Browser (React + Three.js)
        ↕ REST API (port 3000)
Node.js + Express Backend (port 4000)
        ↕ Mongoose ODM
MongoDB (port 27017)

Browser → POST /recommend → FastAPI AI Service (port 8000) → Python color theory engine
```

---

##  Folder Structure

```
virtual-tryon/
├── frontend/                  # React + Three.js app
│   ├── src/
│   │   ├── components/
│   │   │   ├── MannequinViewer.jsx      # 3D viewer (React Three Fiber)
│   │   │   ├── OutfitLayer.jsx          # 3D clothing overlays
│   │   │   ├── ClothingPanel.jsx        # Right sidebar wardrobe
│   │   │   ├── DragDropClothing.jsx     # Draggable clothing cards
│   │   │   ├── CustomizationPanel.jsx   # Left sidebar body settings
│   │   │   ├── TopBar.jsx               # Header with actions
│   │   │   └── AISuggestionsPanel.jsx   # AI color recommendations
│   │   ├── context/
│   │   │   └── OutfitContext.jsx        # Global state (React Context)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                   # Node.js + Express API
│   ├── server.js
│   ├── models/
│   │   ├── Clothing.js                  # Mongoose clothing schema
│   │   └── Outfit.js                    # Mongoose outfit schema
│   ├── routes/
│   │   ├── clothes.js                   # GET /clothes, GET /clothes/:category
│   │   └── outfit.js                    # POST /outfit/save, GET /outfit/suggestions
│   └── .env
│
├── ai-service/                # Python FastAPI AI service
│   ├── main.py                          # FastAPI app + endpoints
│   ├── color_recommender.py             # Color theory logic
│   └── requirements.txt
│
├── database/
│   └── seeds/
│       └── seed.js                      # MongoDB seed script
│
└── README.md
```

---

##  Setup & Run

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB (local or Atlas)

---

### 1. Clone / Setup

```bash
git clone <repo>
cd virtual-tryon
```

---

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

---

### 3. Backend

```bash
cd backend
npm install

# Edit .env if needed:
# MONGO_URI=mongodb://localhost:27017/virtual_tryon
# PORT=4000

npm run dev
# → http://localhost:4000
```

---

### 4. AI Service

```bash
cd ai-service
pip install -r requirements.txt
python main.py
# → http://localhost:8000
# → API docs at http://localhost:8000/docs
```

---

### 5. Seed Database (optional)

```bash
cd backend
npm install
node ../database/seeds/seed.js
```

---

##  API Reference

### Node.js Backend (port 4000)

| Method | Endpoint               | Description                          |
|--------|------------------------|--------------------------------------|
| GET    | /clothes               | Get all clothing items               |
| GET    | /clothes/:category     | Get by category (top/bottom/dress)   |
| POST   | /clothes               | Add a new clothing item              |
| DELETE | /clothes/:id           | Remove a clothing item               |
| POST   | /outfit/save           | Save an outfit combination           |
| GET    | /outfit/suggestions    | Get saved outfit suggestions         |

### FastAPI AI Service (port 8000)

| Method | Endpoint    | Description                         |
|--------|-------------|-------------------------------------|
| POST   | /recommend  | Get color-based bottom suggestions  |
| GET    | /colors     | List all supported colors           |
| GET    | /health     | Service health check                |

#### /recommend Request Body
```json
{ "top_color": "blue" }
```

#### /recommend Response
```json
{
  "top_color": "blue",
  "suggested_bottoms": ["orange", "coral", "teal", "navy", "white", "black", "grey", "beige"],
  "complementary": ["orange", "coral"],
  "analogous": ["teal", "navy", "purple"],
  "neutral": ["white", "black", "grey", "beige"]
}
```

---

##  Features

### 3D Mannequin
- Built with React Three Fiber (declarative Three.js)
- Procedural mannequin from primitive shapes (no .glb required)
- OrbitControls: rotate, zoom, pan
- Contact shadows + environment lighting

### Body Customization
- 3 body types (Slim / Medium / Curvy) → scales mannequin mesh
- 3 skin tones → updates material color

### Drag & Drop Clothing
- Drag from right panel → drop onto center mannequin
- Or click to instantly equip
- Layer system: Top / Bottom / Dress (mutually exclusive)
- Visual equipped indicator

### AI Stylist
- Pick a top color in the AI panel
- FastAPI calls color theory engine
- Returns complementary, analogous, and neutral pairings

### Outfit Management
- Save outfit to MongoDB
- Screenshot via canvas capture
- Reset outfit
- Layer-by-layer removal

---

##  Color Theory Explained

The AI module uses three pairing strategies:

| Strategy      | Logic                                      | Example (blue top)       |
|---------------|--------------------------------------------|--------------------------|
| Complementary | ~180° opposite on color wheel              | orange, coral            |
| Analogous     | Adjacent colors (±30°–60°)                 | teal, navy, purple       |
| Neutral       | Universal safe pairings                    | white, black, grey, beige|

---

##  Tech Stack

| Layer    | Technology                                    |
|----------|-----------------------------------------------|
| Frontend | React 18, Three.js, React Three Fiber, Tailwind CSS |
| Backend  | Node.js, Express.js                           |
| AI       | Python, FastAPI, Pydantic                     |
| Database | MongoDB, Mongoose                             |
| Build    | Vite, PostCSS, Autoprefixer                   |

---

##  MongoDB Schema

### Clothing
```js
{
  name:      String,   // "Blue Oxford Shirt"
  category:  String,   // "top" | "bottom" | "dress"
  color:     String,   // "blue"
  image_url: String,   // "/public/clothes/tops/blue_shirt.png" (optional)
  tags:      [String], // ["smart", "casual"]
  brand:     String,
  createdAt: Date,
  updatedAt: Date
}
```

### Outfit
```js
{
  top:    ObjectId (ref: Clothing),
  bottom: ObjectId (ref: Clothing),
  dress:  ObjectId (ref: Clothing),
  name:   String,
  screenshot_url: String,
  createdAt: Date
}
```
### Screenshots
<img width="1919" height="1008" alt="Screenshot 2026-04-22 113007" src="https://github.com/user-attachments/assets/702a351c-5cab-49bd-b2ab-b77fb94e2dfc" />

<img width="1918" height="1020" alt="Screenshot 2026-04-22 113809" src="https://github.com/user-attachments/assets/61702ba0-9d60-48dd-acc0-9f898f4c5387" />
<img width="1919" height="989" alt="Screenshot 2026-04-22 113820" src="https://github.com/user-attachments/assets/10ff4db6-1a70-4fad-8133-eaa05a0eee38" />
<img width="1915" height="1007" alt="Screenshot 2026-04-22 113829" src="https://github.com/user-attachments/assets/149dcfaf-3a72-4429-b9f5-08a512bb3f00" />
<img width="1845" height="433" alt="Screenshot 2026-04-22 122132" src="https://github.com/user-attachments/assets/4a8dfa14-f8a0-4119-a975-8d99acf8275f" />
<img width="572" height="989" alt="Screenshot 2026-04-22 112950" src="https://github.com/user-attachments/assets/5898d505-0326-4a9d-931e-7c4b02ce0707" />


