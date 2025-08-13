# Netlify Rollback Guide for NCO Search

## Quick Rollback via Netlify Dashboard

### Step 1: Access Netlify Dashboard
1. Go to [netlify.com](https://netlify.com) and sign in
2. Find your site: `statethonfrontend`
3. Click on the site to open the dashboard

### Step 2: Navigate to Deploys
1. In the left sidebar, click on "Deploys"
2. You'll see a list of all your deployments with timestamps

### Step 3: Rollback to Previous Version
1. Find the deployment you want to rollback to
2. Click the three dots (⋮) next to that deployment
3. Select "Rollback to this deploy"
4. Confirm the rollback

## Alternative: Git-based Rollback

### If you have Git history:
```bash
# Check your git log to find the commit you want to rollback to
git log --oneline -10

# Reset to a specific commit
git reset --hard <commit-hash>

# Force push to trigger new deployment
git push --force origin main
```

### If you want to create a new branch from old version:
```bash
# Create a new branch from a specific commit
git checkout -b rollback-branch <commit-hash>

# Push the new branch
git push origin rollback-branch
```

## Option 3: Manual Rollback via Netlify CLI

### Install Netlify CLI:
```bash
npm install -g netlify-cli
```

### Login and rollback:
```bash
# Login to Netlify
netlify login

# List your sites
netlify sites:list

# List deployments for your site
netlify deploy:list --site=statethonfrontend

# Rollback to a specific deployment
netlify deploy:rollback --site=statethonfrontend --deploy-id=<deploy-id>
```

## Option 4: Revert Code Changes

If you want to revert specific code changes:

### Check what files have changed:
```bash
git status
git diff HEAD~1
```

### Revert specific files:
```bash
git checkout HEAD~1 -- src/components/YourComponent.tsx
git commit -m "Revert problematic component"
git push origin main
```

## Important Notes:

1. **Backup Current Version**: Before rolling back, make sure you have a backup of your current code
2. **Database/API**: If your app connects to a database or API, ensure the old version is compatible
3. **Environment Variables**: Check if your old version needs different environment variables
4. **Dependencies**: Ensure package.json versions are compatible with the old code

## Emergency Rollback (If dashboard is not accessible):

1. **Contact Netlify Support**: If you can't access the dashboard
2. **Use Netlify CLI**: Install and use the CLI for rollback
3. **Redeploy from Git**: Force push an old commit to trigger new deployment

## After Rollback:

1. **Test the site**: Visit `statethonfrontend.netlify.app` to verify the rollback
2. **Check functionality**: Ensure all features work as expected
3. **Monitor logs**: Check for any errors in the Netlify function logs
4. **Update team**: Inform your team about the rollback

## Prevention for Future:

1. **Use feature branches**: Don't deploy directly to main
2. **Test before deploy**: Always test locally before pushing
3. **Use staging environment**: Deploy to staging first
4. **Keep backups**: Regular backups of your codebase
5. **Monitor deployments**: Set up alerts for failed deployments
