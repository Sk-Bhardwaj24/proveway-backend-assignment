# Node.js Video File Handling and Google API Integration

This project aims to facilitate the download of large video files from a specific Google Drive directory using Node.js, and then upload them to another Google Drive directory in a chunked manner. Additionally, it provides an endpoint to monitor the progress of both the download and upload processes.

## Setup

1. **Clone the Repository**:

   ```
   git clone https://github.com/Sk-Bhardwaj24/proveway-backend-assignment.git
   ```

2. **Install Dependencies**:

   ```
   yarn install
   ```

3. **Setup ESLint in VS Code**:

   - Install ESLint plugin in VS Code.

4. **Setup Prettier in VS Code**:

   - Install Prettier plugin in VS Code.
   - Change settings/preferences for Prettier: Make default formatter as Prettier and select (check) format on save.

5. **You can try the project by visiting the following URL**:

   ```
    https://proveway-frontend-rho.vercel.app/

   ```

   **We can see the uploaded media on below drive link**:

   ```
    https://drive.google.com/drive/folders/1sk2RwEzmU1-feA35dhn38bVJlJG9RW2j8RAUOeVreYlfmlleQrrrzCyjzQNLIPvEFznXuBtL?usp=sharing

   ```

6. **Note**
   :-we can also use dynamic uploading path.

## Usage

### Video File Handling

#### Download and Upload Process

1. **Initiate Download and Upload**:

   - Send a request to the appropriate endpoint with necessary parameters such as source Google Drive video ID or file path and destination Google Drive directory ID.

   ```yaml
    POST https://proveway-backend-assignment-production.up.railway.app/api/videos/download
    Content-Type: application/json
    token: <your-auth-token>

    {
        "sourceFile": "<source videos file. should be shared as view access>"
    }
   ```

2. **Monitor Progress of Downloading file**:

   - Use the provided endpoint to monitor the status the download which will provide visibility into the progress of each chunk.

   ```yaml
   GET https://proveway-backend-assignment-production.up.railway.app/api/videos/download-progress
   Content-Type: application/json
    token: <your-auth-token>
   ```

3. **Monitor Progress of uploading file**:

   - Use the provided endpoint to monitor the status the download which will provide visibility into the progress of each chunk.

   ```yaml
   GET https://proveway-backend-assignment-production.up.railway.app/api/videos/upload-progress
   Content-Type: application/json
    token: <your-auth-token>
   ```

## Documentation

For detailed information on interacting with the Google Drive API, please refer to the official documentation:

- [Google Drive API Documentation](https://developers.google.com/drive)
