# Supabase Setup Instructions

This guide will help you set up Supabase to store and manage website hosting orders.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign up with GitHub or email
3. Create a new project:
   - Choose a project name (e.g., "MasterHosting")
   - Set a strong database password (save this!)
   - Select a region close to you
   - Click "Create new project"

## Step 2: Create the Orders Table

1. In your Supabase dashboard, click on "SQL Editor" in the left sidebar
2. Click "New query"
3. Copy and paste the entire contents of `supabase-schema.sql` into the editor
4. Click "Run" to execute the SQL
5. You should see a success message

This will create:
- An `orders` table with all necessary columns
- Indexes for better performance
- Row Level Security policies
- An auto-update trigger for the `updated_at` column

## Step 3: Get Your Supabase Credentials

1. In your Supabase dashboard, click on "Settings" (gear icon) in the left sidebar
2. Click on "API" under Project Settings
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (a long string starting with `eyJ...`)

## Step 4: Update Your .env File

1. Open your `.env` file (create one if it doesn't exist by copying `.env.example`)
2. Add these lines with your actual Supabase credentials:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with the ones you copied from Step 3.

## Step 5: Test the Integration

1. Restart your server:
   ```bash
   npm start
   ```

2. You should see in the console:
   ```
   ✅ Supabase client initialized
   ```

3. Go to `http://localhost:3000/order` and submit a test order

4. Check your Supabase dashboard:
   - Click "Table Editor" in the left sidebar
   - Select the "orders" table
   - You should see your test order!

5. Go to `http://localhost:3000/admin` to view orders in the admin dashboard

## Features

### Order Management
- **View all orders**: See all customer orders in a clean table format
- **Order details**: Click "View" to expand and see full order information
- **Status management**: Change order status (pending → in_progress → completed)
- **Delete orders**: Remove orders if needed
- **Statistics**: Dashboard shows total, pending, in progress, and completed orders

### Order Statuses
- **pending**: New order, not yet started
- **in_progress**: Currently being set up
- **completed**: Website is live and ready
- **cancelled**: Order was cancelled

### Email Notifications
When a customer submits an order:
1. Order is saved to Supabase database
2. Admin receives detailed email with all order information
3. Customer receives confirmation email with next steps

## Troubleshooting

### "Supabase credentials not configured" warning
- Make sure your `.env` file has the correct `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- Restart your server after updating `.env`

### Orders not appearing in admin dashboard
- Check that the SQL schema was executed successfully
- Verify your Supabase credentials are correct
- Check browser console for any errors

### "Failed to insert order" error
- Verify the `orders` table exists in Supabase
- Check that Row Level Security policies are set correctly
- Make sure all required fields are being sent from the form

## Database Schema

The `orders` table includes:

**Personal Information:**
- `full_name` - Customer's full name
- `email` - Customer's email address
- `discord_username` - Optional Discord username

**Website Details:**
- `selected_domain` - Chosen domain (masterhostinig.online or defendaminecraft.online)
- `subdomain` - Requested subdomain
- `full_subdomain` - Complete subdomain URL
- `website_type` - Type of website
- `website_description` - Description of the website

**Technical Requirements:**
- `tech_stack` - Technology stack to use
- `need_database` - Whether database is needed
- `need_ssl` - Whether SSL certificate is needed
- `estimated_traffic` - Expected traffic level

**Additional Information:**
- `github_repo` - Optional GitHub repository URL
- `additional_notes` - Any additional notes
- `status` - Order status (pending, in_progress, completed, cancelled)
- `ip_address` - Customer's IP address
- `user_agent` - Customer's browser information

**Metadata:**
- `id` - Unique order ID (UUID)
- `created_at` - When order was created
- `updated_at` - When order was last updated

## Security Notes

- The `anon` key is safe to use in client-side code
- Row Level Security (RLS) is enabled on the orders table
- Never commit your `.env` file to version control
- Keep your database password secure

## Next Steps

1. Customize the email templates in `server.js` if needed
2. Add authentication to the admin dashboard for security
3. Set up automated deployment notifications
4. Consider adding a customer portal for order tracking

## Support

If you encounter any issues:
1. Check the Supabase documentation: https://supabase.com/docs
2. Review the server logs for error messages
3. Verify all environment variables are set correctly
