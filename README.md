# Yarn Inventory CRUD Application

A complete full-stack CRUD application for managing yarn inventory, built with modern web technologies and containerized with Docker.

## 🚀 Tech Stack

- **Backend**: Node.js + Express.js API
- **Frontend**: Vue.js 3 (Composition API) + Vue Router
- **Database**: MariaDB
- **Styling**: TailwindCSS (Dark theme only)
- **Containerization**: Docker + Docker Compose
- **Development**: Vite, Hot reloading

## 📋 Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Responsive design with dark theme
- ✅ Form validation (frontend + backend)
- ✅ Search and filter functionality
- ✅ Soft delete implementation
- ✅ RESTful API design
- ✅ Docker containerization
- ✅ Hot reloading for development

## 🏗️ Project Structure

```
yarn-crud/
├── backend/                 # Node.js/Express API
│   ├── routes/
│   │   └── yarn.js         # CRUD routes
│   ├── package.json
│   ├── server.js           # Main server file
│   ├── db.js              # Database connection
│   └── .env               # Environment variables
├── frontend/               # Vue.js SPA
│   ├── src/
│   │   ├── views/         # Vue components
│   │   ├── router/        # Vue Router config
│   │   ├── App.vue        # Root component
│   │   └── main.js        # App entry point
│   ├── package.json
│   └── vite.config.js     # Vite configuration
├── docker/                 # Docker configurations
│   ├── init.sql           # Database initialization
│   ├── Dockerfile.backend  # Backend container
│   ├── Dockerfile.frontend # Frontend container
│   └── nginx.conf         # Nginx config for frontend
└── docker-compose.yml      # Multi-container orchestration
```

## 🛠️ Development Setup

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development without Docker)
- Git

### Quick Start with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yarn-crud
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000
   - Database: localhost:3306

### Local Development (Without Docker)

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Database**
   - Install MariaDB locally
   - Run the SQL script in `docker/init.sql`
   - Update `backend/.env` with your local DB credentials

## 📖 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### GET /api/yarn
Retrieve all yarns (with optional filtering)
- Query params: `?brand=...&color=...`

#### GET /api/yarn/:id
Retrieve a single yarn by ID

#### POST /api/yarn
Create a new yarn
- Body: JSON with yarn data

#### PUT /api/yarn/:id
Update an existing yarn
- Body: JSON with updated yarn data

#### DELETE /api/yarn/:id
Soft delete a yarn

### Sample API Usage

```javascript
// Create a new yarn
fetch('/api/yarn', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 1,
    brand: 'Red Heart',
    name: 'Super Saver',
    start_len: 364,
    start_weight: 198,
    curr_weight: 198
  })
});
```

## 🔧 Configuration

### Environment Variables

Create `.env` files in the respective directories:

**Backend (.env)**
```
DB_HOST=db
DB_USER=root
DB_PASSWORD=password
DB_NAME=yarn_inventory_db
DB_PORT=3306
PORT=3000
```

**Frontend**
- No environment variables needed for basic setup
- API calls are proxied through Vite config

## 🚀 Production Deployment

### Docker Deployment

1. **Build and run**
   ```bash
   docker-compose -f docker-compose.yml up -d --build
   ```

2. **Scale services** (optional)
   ```bash
   docker-compose up -d --scale backend=3
   ```

### Cloud Deployment Options

#### Heroku
```bash
# Install Heroku CLI
heroku create your-app-name

# Deploy
git push heroku main
```

#### AWS/DigitalOcean
1. Build images: `docker-compose build`
2. Push to container registry
3. Deploy to ECS/Fargate or Droplets

### Environment Variables for Production
```bash
NODE_ENV=production
DB_HOST=your-production-db-host
DB_USER=your-db-user
DB_PASSWORD=your-secure-password
DB_NAME=your-db-name
```

## 🔒 Security Considerations

- ✅ Prepared statements prevent SQL injection
- ✅ Input validation on both frontend and backend
- ✅ CORS configured for development
- ✅ Non-root user in Docker containers
- ✅ Security headers in nginx config

### Production Security
- Use environment variables for secrets
- Implement authentication/authorization
- Add rate limiting
- Use HTTPS
- Regular security updates

## 🧪 Testing

### Manual Testing
1. Create a yarn record
2. Edit the record
3. Search/filter yarns
4. Delete a record
5. Test responsive design on mobile

### API Testing
```bash
# Test health endpoint
curl http://localhost:3000/

# Test yarn endpoints
curl http://localhost:3000/api/yarn
```

## 📚 Extending the Application

### Adding New Fields
1. Update database schema in `docker/init.sql`
2. Modify backend routes to handle new fields
3. Update frontend forms and components

### Adding Authentication
1. Implement JWT tokens
2. Add user management
3. Protect routes with middleware

### Adding Features
- **Pagination**: Modify API to support `?page=1&limit=10`
- **File Uploads**: Add image upload for yarn photos
- **Categories**: Add yarn categories/tags
- **Inventory Tracking**: Add low stock alerts

### Database Migrations
For production, use migration tools like:
- Flyway (SQL-based)
- Sequelize migrations (code-based)

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
- Ensure MariaDB container is healthy
- Check environment variables
- Verify network connectivity

**Frontend Not Loading**
- Check if backend is running
- Verify API endpoints
- Check browser console for errors

**Hot Reloading Not Working**
- Ensure volumes are mounted correctly
- Check file permissions
- Restart containers

### Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Vue.js team for the excellent framework
- TailwindCSS for beautiful styling
- Docker for containerization
- MariaDB for reliable database

---

**Happy coding! 🎉**

For questions or issues, please open a GitHub issue.