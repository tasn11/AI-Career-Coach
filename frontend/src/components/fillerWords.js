// index.js (Node example)

const { createClient } = require("@deepgram/sdk");

const deepgramApiKey = "17ca53b0e9120f3be52f1f145eff68fe6c72900c";
let text; //the text that will be transcribed
let wordsArray; //the text that will be transcribed

function findFillerWords(text) {
    const fillerWords = [
        'you know',
        'uh',
        'literally',
        'I mean',
        'um',
        'you see',
        'you know what I mean',
        'or something',
        'like',
        'sort of',
        'kind of',
        'so basically',
        'or something like that',
        'so'
    ];

    const regex = new RegExp('\\b(' + fillerWords.join('|') + ')\\b', 'gi');
    const matches = text.match(regex) || [];

    console.log(matches);
}


// Transcribe an audio file from a local file:
const transcribeFile = async (URL) => {
    const deepgram = createClient(deepgramApiKey);

    const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
        {
            url: URL,
        },
        {
            smart_format: true,
            model: "nova-2",
            filler_words: true,
        }
    );

    if (error) throw error;
    if (!error) {
        text = result.results.channels[0].alternatives[0].transcript;
        wordsArray = result.results.channels[0].alternatives[0].words.map(({ word, start }) => [word, start]);
    }
};

transcribeFile("https://dpgr.am/spacewalk.wav").then(() => {
    console.log(text, wordsArray);
    //findFillerWords(text)
});

