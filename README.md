# Auralis

Auralis is a web application for listing and discovering unique properties and vacation rentals around the world. Built using Node.js, Express, MongoDB, and EJS, it provides a platform to showcase diverse accommodations including beachfront cottages, mountain cabins, luxury villas, and more.

## Features

- **Browse Listings:** View a curated selection of properties from various countries, complete with images, descriptions, prices, and locations.
- **Add New Listings:** Easily add new property listings through an intuitive form (see `/listing/new` route).
- **Database Initialization:** Includes sample data and scripts to quickly seed the MongoDB database for development or demo purposes.
- **Dynamic Views:** Uses EJS templates for rendering beautiful, responsive pages.

## Data Model

Listings are stored in MongoDB using a schema with the following fields:

- `title`: Name of the property
- `description`: Detailed info about the property
- `image`: Includes `url` and `filename` for property images
- `price`: Rental price
- `location`: City/area
- `country`: Country

See [`models/listing.js`](models/listing.js) for the full schema.

## Getting Started

### Prerequisites

- Node.js & npm
- MongoDB (local or remote)

### Installation

```bash
git clone https://github.com/OfficialSahil548k/Auralis.git
cd Auralis
npm install
```

### Database Setup

To seed the database with sample listings:

```bash
node init/index.js
```

This connects to MongoDB at `mongodb://127.0.0.1:27017/Auralis` and populates the listings collection.

### Running the App

```bash
npm start
```

Visit `http://localhost:8800` in your browser.

## Project Structure

- `app.js` – Main Express application
- `models/listing.js` – Mongoose schema for listings
- `init/data.js` & `init/index.js` – Sample data & DB seeder
- `views/` – EJS view templates
- `public/` – Static assets (CSS, images, etc.)

## Contributing

Pull requests and suggestions are welcome! Please open an issue or PR to discuss your ideas or report bugs.

## License

MIT

## Author

- [OfficialSahil548k](https://github.com/OfficialSahil548k)

---
Happy exploring and listing!
