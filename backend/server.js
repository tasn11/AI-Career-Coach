const express = require('express');
const multer = require('multer');
const path = require('path');
const { createClient } = require('@deepgram/sdk');
const fs = require("fs");
const app = express();
const cors = require('cors');

app.use(cors());
const port = process.env.PORT || 5000;

const deepgramApiKey = 'XXXXX';
const deepgram = createClient(deepgramApiKey);

app.use(express.json());

app.post('/transcribe', async (req, res) => {
    try {
        const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
            fs.readFileSync("audio.wav"),
            {
                smart_format: true,
                model: "nova",
                filler_words: true,
            }
        );

        if (error) {
            res.status(500).json({ error: 'Deepgram transcription error' });
        } else {
            res.json({ transcript: result.results.channels[0].alternatives[0].transcript });
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

if (process.env.NODE_ENV === 'production') {
    // Serve static files from the React app
    app.use(express.static(path.join(__dirname, 'client/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello, this is your server!');
});

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, ''));
    },
    filename: (req, file, cb) => {
        cb(null, 'audio.wav'); // You can customize the filename if needed
    },
});

const upload = multer({ storage });

app.post('/upload', upload.single('audio'), (req, res) => {
    res.json({ message: 'File uploaded successfully!' });
});
