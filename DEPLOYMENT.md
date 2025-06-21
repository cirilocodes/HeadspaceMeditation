# Deployment Guide

This guide covers deploying the Mindful meditation app to various platforms.

## Prerequisites

Before deploying, ensure you have:
- PostgreSQL database (Neon, Supabase, or self-hosted)
- Google OAuth credentials configured
- Environment variables ready

## Platform-Specific Deployments

### 1. Vercel (Recommended for Frontend + API)

#### Setup
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Configure build settings

#### Environment Variables
```
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=https://your-domain.vercel.app/api/auth/google/callback
SESSION_SECRET=your_session_secret
NODE_ENV=production
```

#### Build Configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/client",
  "installCommand": "npm install",
  "framework": "vite"
}
```

### 2. Railway

#### Setup
1. Connect GitHub repository to Railway
2. Railway auto-detects the Node.js app
3. Add PostgreSQL service if needed

#### Configuration
- Railway automatically sets PORT environment variable
- Add other environment variables in Railway dashboard
- Enable persistent storage if needed

### 3. Heroku

#### Setup
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-app-name

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set GOOGLE_CLIENT_ID=your_client_id
heroku config:set GOOGLE_CLIENT_SECRET=your_client_secret
heroku config:set SESSION_SECRET=your_session_secret
heroku config:set GOOGLE_CALLBACK_URL=https://your-app-name.herokuapp.com/api/auth/google/callback

# Deploy
git push heroku main
```

#### Procfile
```
web: npm start
```

### 4. DigitalOcean App Platform

#### Setup
1. Connect GitHub repository
2. Configure app spec
3. Add environment variables

#### App Spec (app.yaml)
```yaml
name: mindful-app
services:
- name: web
  source_dir: /
  github:
    repo: your-username/your-repo
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: DATABASE_URL
    value: ${db.DATABASE_URL}
  - key: GOOGLE_CLIENT_ID
    value: your_client_id
  - key: GOOGLE_CLIENT_SECRET
    value: your_client_secret
    type: SECRET
  - key: SESSION_SECRET
    value: your_session_secret
    type: SECRET
databases:
- name: db
  engine: PG
  version: "14"
```

### 5. AWS (EC2 + RDS)

#### Setup EC2 Instance
```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone and setup your app
git clone your-repo-url
cd your-app
npm install
npm run build

# Create .env file with production values
# Start with PM2
pm2 start npm --name "mindful-app" -- start
pm2 startup
pm2 save
```

#### Configure RDS PostgreSQL
1. Create RDS PostgreSQL instance
2. Update security groups for EC2 access
3. Update DATABASE_URL in environment

### 6. Google Cloud Platform

#### App Engine Setup
Create `app.yaml`:
```yaml
runtime: nodejs18

env_variables:
  DATABASE_URL: postgresql://...
  GOOGLE_CLIENT_ID: your_client_id
  GOOGLE_CLIENT_SECRET: your_client_secret
  SESSION_SECRET: your_session_secret
  NODE_ENV: production

automatic_scaling:
  min_instances: 1
  max_instances: 10
```

Deploy:
```bash
gcloud app deploy
```

## Database Setup

### Using Neon (Recommended)
1. Sign up at [Neon](https://neon.tech)
2. Create a new database
3. Copy connection string
4. Run database migrations:
   ```bash
   npm run db:push
   ```

### Using Supabase
1. Create project at [Supabase](https://supabase.com)
2. Get PostgreSQL connection details
3. Update DATABASE_URL
4. Run migrations

### Self-hosted PostgreSQL
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE mindful_db;
CREATE USER mindful_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE mindful_db TO mindful_user;
\q
```

## Google OAuth Setup

### Development
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create/select project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`

### Production
1. Update authorized redirect URIs:
   - `https://yourdomain.com/api/auth/google/callback`
2. Verify domain ownership if required
3. Update privacy policy and terms of service URLs

## SSL/TLS Setup

### Using Cloudflare (Recommended)
1. Add your domain to Cloudflare
2. Update DNS records
3. Enable SSL/TLS encryption
4. Configure security settings

### Using Let's Encrypt (Self-hosted)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Environment Variables Checklist

Required for all deployments:
- [ ] `DATABASE_URL`
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `GOOGLE_CALLBACK_URL`
- [ ] `SESSION_SECRET`
- [ ] `NODE_ENV=production`

Optional:
- [ ] `PORT` (usually auto-set by platform)
- [ ] Custom domain settings
- [ ] CDN configuration

## Health Checks

Add health check endpoint in your app:
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
```

## Monitoring and Logging

### Basic Logging
```javascript
// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});
```

### Error Tracking
Consider integrating:
- Sentry for error tracking
- LogRocket for user session recording
- Google Analytics for usage analytics

## Performance Optimization

### Client-side
- Enable gzip compression
- Use CDN for static assets
- Implement service worker for caching
- Optimize images and fonts

### Server-side
- Enable response compression
- Implement database connection pooling
- Add Redis for session storage (optional)
- Use PM2 cluster mode for multiple processes

## Backup Strategy

### Database Backups
```bash
# Automated daily backups
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Code Backups
- Use Git with multiple remotes
- Regular deployment tags
- Automated testing before deployment

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] Rate limiting implemented
- [ ] CORS properly configured
- [ ] Security headers added
- [ ] Dependencies updated regularly

## Troubleshooting

### Common Issues

1. **OAuth Callback Error**
   - Check callback URL matches exactly
   - Verify domain is authorized

2. **Database Connection Issues**
   - Check connection string format
   - Verify network access
   - Check SSL requirements

3. **Session Issues**
   - Ensure SESSION_SECRET is set
   - Check session store configuration
   - Verify cookie settings for HTTPS

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are listed
   - Check TypeScript compilation

### Debug Commands
```bash
# Check environment variables
printenv | grep -E "(DATABASE|GOOGLE|SESSION)"

# Test database connection
npm run db:push

# Check application logs
pm2 logs mindful-app

# Monitor resource usage
pm2 monit
```

## Post-Deployment

1. Test all authentication flows
2. Verify database operations
3. Check audio/video streaming
4. Test mobile responsiveness
5. Monitor error rates and performance
6. Set up analytics and monitoring
7. Configure backup schedules

## Scaling Considerations

### Horizontal Scaling
- Use load balancer
- Implement session store (Redis)
- Consider microservices architecture
- Database read replicas

### Vertical Scaling
- Monitor resource usage
- Upgrade server specifications
- Optimize database queries
- Implement caching strategies

This deployment guide should help you successfully deploy the Mindful meditation app to production. Choose the platform that best fits your needs and budget.