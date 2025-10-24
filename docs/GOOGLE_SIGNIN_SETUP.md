# Google Sign-In Setup Instructions

This document explains how to configure Google Sign-In for the Sheet Snap application.

## Prerequisites

You need to create OAuth 2.0 credentials in the Google Cloud Console.

## Steps to Set Up Google OAuth Credentials

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Sheets API** and **Google Drive API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API" and click "Enable"
   - Search for "Google Drive API" and click "Enable"

### 2. Create OAuth 2.0 Credentials

#### For iOS

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "iOS" as the application type
4. Enter your bundle identifier (from `app.json` under `ios.bundleIdentifier`)
5. Click "Create"
6. Copy the **iOS Client ID**

#### For Android

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Android" as the application type
4. Enter your package name (from `app.json` under `android.package`)
5. Get your SHA-1 certificate fingerprint:

   ```bash
   # For development (debug keystore)
   keytool -keystore ./android/app/debug.keystore -list -v
   ```

6. Enter the SHA-1 fingerprint
7. Click "Create"

#### For Web (Required for Expo)

1. Click "Create Credentials" > "OAuth client ID"
2. Select "Web application" as the application type
3. Add authorized redirect URIs (for development):
   - `https://auth.expo.io/@plandoer/sheet-snap`
4. Click "Create"
5. Copy the **Web Client ID** and **Client Secret**

### 3. Configure the Application

Update the file `config/google-signin.ts` with your credentials:

```typescript
GoogleSignin.configure({
  iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
  webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.readonly",
  ],
  offlineAccess: true,
});
```

### 4. Update app.json (Optional)

You may want to add the Google Sign-In plugin to your `app.json`:

```json
{
  "expo": {
    "plugins": ["@react-native-google-signin/google-signin"]
  }
}
```

### 5. Rebuild the App

After updating the configuration:

```bash
# For iOS
npx expo run:ios

# For Android
npx expo run:android

# For development with Expo Go (limited support)
npx expo start
```

## Scopes Explained

The app requests the following scopes:

- `https://www.googleapis.com/auth/spreadsheets` - Full access to Google Sheets
- `https://www.googleapis.com/auth/drive.readonly` - Read-only access to Google Drive (to list sheets)

## Troubleshooting

### Common Issues

1. **Error: DEVELOPER_ERROR**
   - Make sure your SHA-1 fingerprint is correct (Android)
   - Verify your bundle identifier matches (iOS)
2. **Error: API not enabled**

   - Enable Google Sheets API and Google Drive API in Cloud Console

3. **Error: Invalid client**

   - Double-check your Client IDs in `config/google-signin.ts`

4. **Expo Go limitations**
   - Google Sign-In may not work properly in Expo Go
   - Use `npx expo run:ios` or `npx expo run:android` for development builds

## Testing

After successful login, check the console logs for user information:

- User ID
- Name
- Email
- Profile Picture URL

## Security Notes

- Never commit your Client Secret to version control
- Consider using environment variables for production
- Implement proper token refresh logic for production use
