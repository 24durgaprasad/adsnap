const router = require("express").Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { createClient } = require("pexels");
const fs = require('fs');
const fsp = require('fs/promises'); // Import fs promises
const path = require('path');
const { spawn } = require('child_process');
const axios = require('axios');

// --- Helper Functions ---

/**
 * Parses the storyboard text from the AI into a structured object.
 * Handles both Markdown table and list formats.
 */
function parseStoryboard(text) {
    console.log("  -> Attempting to parse raw storyboard text...");
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const titleLine = lines.find(l => l.trim().startsWith('##'));
    const title = titleLine ? titleLine.replace('##', '').trim() : 'Untitled Video Ad';

    let scenes = [];

    // Strategy 1: Parse Markdown Table
    const isTable = lines.some(l => l.includes('|') && /panel|scene|visual/i.test(l));
    if (isTable) {
        console.log("  -> Parsing as Markdown table.");
        const headerIndex = lines.findIndex(l => l.includes('|') && l.includes('---') === false);
        if (headerIndex === -1) return null;

        const header = lines[headerIndex].split('|').map(h => h.trim().toLowerCase());
        const visualIndex = header.findIndex(h => h.includes('visual') || h.includes('description'));
        const audioIndex = header.findIndex(h => h.includes('audio') || h.includes('voiceover'));
        const textIndex = header.findIndex(h => h.includes('text'));

        if (visualIndex === -1) return null;

        for (let i = headerIndex + 1; i < lines.length; i++) {
            if (!lines[i].includes('|') || lines[i].includes('---')) continue;
            const columns = lines[i].split('|').map(c => c.trim()).filter(Boolean); // Filter out empty strings from start/end pipes
            if (columns.length < header.filter(Boolean).length) continue;

            scenes.push({
                scene: scenes.length + 1,
                visual: columns[visualIndex] || '',
                audio: (audioIndex !== -1 && columns[audioIndex]) ? columns[audioIndex] : '',
                onScreenText: (textIndex !== -1 && columns[textIndex]) ? columns[textIndex] : ''
            });
        }
    } else { // Strategy 2: Parse formatted list
        console.log("  -> Parsing as formatted list.");
        let currentScene = null;
        for (const line of lines) {
            const trimmedLine = line.trim();
            const sceneMatch = trimmedLine.match(/^\*\*(?:Scene|Panel)\s*(\d+):?\s*\*\*/i);
            if (sceneMatch) {
                if (currentScene) scenes.push(currentScene);
                currentScene = { scene: parseInt(sceneMatch[1], 10), visual: '', audio: '', onScreenText: '' };
            } else if (currentScene) {
                if (trimmedLine.match(/\*\*(Visual|Description):\*\*/i)) {
                    currentScene.visual += ' ' + trimmedLine.replace(/\*\*(Visual|Description):\*\*/i, '').trim();
                } else if (trimmedLine.match(/\*\*(Audio|Voiceover):\*\*/i)) {
                    currentScene.audio += ' ' + trimmedLine.replace(/\*\*(Audio|Voiceover):\*\*/i, '').trim();
                } else if (trimmedLine.match(/\*\*(On-Screen Text|Text Overlay):\*\*/i)) {
                    currentScene.onScreenText += ' ' + trimmedLine.replace(/\*\*(On-Screen Text|Text Overlay):\*\*/i, '').trim();
                }
            }
        }
        if (currentScene) scenes.push(currentScene);
    }
    
    // Clean up whitespace and remove quotes from final parsed data
    scenes.forEach(scene => {
        scene.visual = scene.visual.trim().replace(/^"(.*)"$/, '$1');
        scene.audio = scene.audio.trim().replace(/^"(.*)"$/, '$1');
        scene.onScreenText = scene.onScreenText.trim().replace(/^"(.*)"$/, '$1');
    });

    return scenes.length > 0 ? { title, scenes } : null;
}

async function findPexelsVideo(query) {
    try {
        if (!query || query.trim() === '') return null;
        console.log(`   -> Searching Pexels for: "${query}"`);
        const response = await pexelsClient.videos.search({ query, per_page: 1, orientation: 'landscape' });
        if (response.videos && response.videos.length > 0) {
            const videoFile = response.videos[0].video_files.find(f => f.quality === 'hd' && f.width === 1920) || response.videos[0].video_files.find(f => f.quality === 'hd') || response.videos[0].video_files[0];
            return videoFile.link;
        }
        console.warn(`   -> No Pexels video found for query: "${query}"`);
        return null;
    } catch (error) {
        console.error("Pexels API Error:", error.message);
        return null;
    }
}

async function generateElevenLabsVoiceover(text, sceneIndex, tempDir) {
    try {
        if (!text || text.trim() === "") return null;
        const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Example Voice ID, replace if needed
        const API_KEY = process.env.ELEVENLABS_API_KEY;
        const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
        const response = await axios.post(url, {
            text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: { stability: 0.5, similarity_boost: 0.75 }
        }, {
            headers: { 'Accept': 'audio/mpeg', 'Content-Type': 'application/json', 'xi-api-key': API_KEY },
            responseType: 'arraybuffer'
        });

        const audioFilePath = path.join(tempDir, `scene_${sceneIndex + 1}_audio.mp3`);
        await fsp.writeFile(audioFilePath, response.data);
        console.log(`   -> Generated voiceover for Scene ${sceneIndex + 1}.`);
        return audioFilePath;
    } catch (error) {
        // **MODIFIED:** Improved error logging for buffers
        let errorMessage = error.message;
        if (error.response && error.response.data) {
            errorMessage = Buffer.isBuffer(error.response.data) 
                ? error.response.data.toString() 
                : JSON.stringify(error.response.data);
        }
        console.error(`ElevenLabs API Error for scene ${sceneIndex + 1}:`, errorMessage);
        return null;
    }
}

function runFFmpegCommand(args, cwd) {
    return new Promise((resolve, reject) => {
        console.log(`   -> Spawning FFmpeg in ${cwd} with args: ffmpeg ${args.join(' ')}`);
        const ffmpeg = spawn('ffmpeg', args, { cwd });
        let stderr = '';
        ffmpeg.stderr.on('data', (data) => { stderr += data.toString(); });
        ffmpeg.on('close', (code) => {
            if (code === 0) {
                console.log('   -> FFmpeg process completed successfully.');
                resolve();
            } else {
                console.error(`FFmpeg stderr:\n${stderr}`);
                reject(new Error(`FFmpeg exited with code ${code}`));
            }
        });
        ffmpeg.on('error', (err) => {
            console.error('Failed to start FFmpeg process.', err);
            reject(err);
        });
    });
}

async function downloadFile(url, filepath) {
    if (!url) throw new Error(`Download failed: URL is null or empty for ${filepath}`);
    console.log(`   -> Downloading from ${url.substring(0, 60)}...`);
    const writer = fs.createWriteStream(filepath);
    const response = await axios({ url, method: 'GET', responseType: 'stream' });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', () => {
            console.log(`   -> Download finished: ${path.basename(filepath)}`);
            resolve();
        });
        writer.on('error', (err) => {
            console.error(`Error downloading file to ${filepath}`, err);
            reject(err);
        });
    });
}

async function createAssFile(text, duration, tempDir, sceneNum) {
    if (!text || text.trim() === '' || text.trim().toLowerCase() === 'none') return null;
    const font = process.platform === 'win32' ? 'Arial' : 'DejaVu Sans';
    const formatTime = (seconds) => `0:${(Math.floor(seconds / 60)).toString().padStart(2, '0')}:${(seconds % 60).toFixed(2).padStart(5, '0')}`;
    const endTime = formatTime(duration - 0.1);
    const assContent = `[Script Info]
PlayResX: 1920
PlayResY: 1080

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,${font},72,&H00FFFFFF,&H000000FF,&H00000000,&H99000000,-1,0,0,0,100,100,0,0,1,2,2,2,10,10,80,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:00.10,${endTime},Default,,0,0,0,,{\\an2}${text.replace(/\\/g, '\\\\').replace(/{/g, '\\{').replace(/}/g, '\\}')}`;
    
    const assFilePath = path.join(tempDir, `scene_${sceneNum}.ass`);
    await fsp.writeFile(assFilePath, assContent.trim());
    console.log(`   -> Created ASS subtitle file: ${path.basename(assFilePath)}`);
    return assFilePath;
}

// --- Client Initializations ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const pexelsClient = createClient(process.env.PEXELS_API_KEY);

// --- Main API Route ---
router.post("/response", async (req, res) => {
    const tempDir = path.join(__dirname, '..', `temp_assets_${Date.now()}`);

    try {
        const { prompt, options } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "Request body must contain a 'prompt' field." });
        }

        console.log("✅ [1/5] Received request. Generating storyboard...");
        
        const systemInstruction = `You are a creative director who creates short, compelling video ad storyboards.
Your output MUST be a Markdown list. Each scene must start with '**Scene [number]:**'.
Each scene MUST contain separate lines for '**Visual:**', '**Audio:**', and '**On-Screen Text:**'.
- The 'Visual' description should be concise and descriptive, perfect for searching a stock video library (e.g., "A smiling woman jogging in a sunny park").
- The 'Audio' is the voiceover script for that scene.
- The 'On-Screen Text' is any text that should be overlaid on the video. If there is no text, write 'None'.
- Do NOT use Markdown tables or any other format.
- Do NOT include any introductory or concluding sentences outside of the storyboard structure.
- Start with a '## Title:' line for the ad's title.`;

        const fullPrompt = `Create a video ad storyboard based on the following request: ${prompt}`;
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction });
        const result = await Promise.race([
            model.generateContent(fullPrompt),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Gemini API call timed out after 30 seconds.")), 30000))
        ]);

        console.log("  -> Received response from Gemini API.");
        const storyboardText = result.response.text();
        const parsedStoryboard = parseStoryboard(storyboardText);

        if (!parsedStoryboard || !parsedStoryboard.scenes || parsedStoryboard.scenes.length === 0) {
            console.error("❌ Failed to parse storyboard. Raw AI response was:\n", storyboardText);
            throw new Error("Could not get a valid storyboard from the AI's response. It may have been in an unexpected format.");
        }
        
        console.log(`✅ [2/5] Storyboard parsed successfully with ${parsedStoryboard.scenes.length} scenes.`);
        await fsp.mkdir(tempDir, { recursive: true });

        const totalDuration = Math.min(parseInt(options?.duration, 10) || 15, 60);
        const sceneDuration = totalDuration / parsedStoryboard.scenes.length;
        
        // **MODIFIED:** Switched from Promise.all to a for...of loop for sequential processing
        console.log("⏳ [2/5] Fetching scene assets sequentially to respect API rate limits...");
        const sceneAssets = [];
        for (const [index, scene] of parsedStoryboard.scenes.entries()) {
            console.log(` -> Fetching assets for Scene ${index + 1}...`);
            const videoUrl = await findPexelsVideo(scene.visual);
            const audioPath = await generateElevenLabsVoiceover(scene.audio, index, tempDir);
            sceneAssets.push({ videoUrl, audioPath });
        }
        console.log("✅ [2/5] All scene assets fetched.");

        const processedScenePaths = [];
        console.log(`⏳ [3/5] Starting FFmpeg scene processing...`);
        for (const [index, scene] of parsedStoryboard.scenes.entries()) {
            const sceneNum = index + 1;
            const asset = sceneAssets[index];
            
            if (!asset.videoUrl) {
                console.warn(`Skipping Scene ${sceneNum} due to missing video.`);
                continue;
            }

            const rawVideoPath = path.join(tempDir, `scene_${sceneNum}_raw.mp4`);
            await downloadFile(asset.videoUrl, rawVideoPath);

            const assFilePath = await createAssFile(scene.onScreenText, sceneDuration, tempDir, sceneNum);
            const processedVideoPath = path.join(tempDir, `scene_${sceneNum}_processed.mp4`);
            
            const audioInputs = asset.audioPath ? ['-i', path.basename(asset.audioPath)] : [];
            const filterAudio = asset.audioPath ? `[1:a]apad,atrim=0:${sceneDuration}[aout]` : `anullsrc=r=44100:cl=stereo,atrim=0:${sceneDuration}[aout]`;
            const mapAudio = ['-map', '[aout]'];
            
            let filterComplex = `[0:v]trim=duration=${sceneDuration},scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1[vout]`;
            if (assFilePath) {
                filterComplex = `[0:v]trim=duration=${sceneDuration},scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,ass='${path.basename(assFilePath)}'[vout]`;
            }

            const args = [
                '-i', path.basename(rawVideoPath),
                ...audioInputs,
                '-filter_complex', `${filterComplex};${filterAudio}`,
                '-map', '[vout]',
                ...mapAudio,
                '-c:v', 'libx264', '-preset', 'fast', '-crf', '23',
                '-c:a', 'aac', '-b:a', '192k',
                '-shortest',
                '-y', path.basename(processedVideoPath)
            ];
            
            await runFFmpegCommand(args, tempDir);
            processedScenePaths.push(processedVideoPath);
        }
        console.log("✅ [3/5] All scenes processed by FFmpeg.");
        
        if (processedScenePaths.length === 0) {
            throw new Error("No scenes could be processed to create a final video.");
        }

        console.log("⏳ [4/5] Concatenating final video...");
        const fileListPath = path.join(tempDir, 'filelist.txt');
        const fileContent = processedScenePaths.map(p => `file '${path.basename(p)}'`).join('\n');
        await fsp.writeFile(fileListPath, fileContent);

        const finalVideoName = `ad_${Date.now()}.mp4`;
        const tempFinalPath = path.join(tempDir, finalVideoName);
        
        const concatArgs = ['-f', 'concat', '-safe', '0', '-i', path.basename(fileListPath), '-c', 'copy', '-y', path.basename(tempFinalPath)];
        await runFFmpegCommand(concatArgs, tempDir);

        const publicDir = path.join(__dirname, '..', 'public');
        const outputDir = path.join(publicDir, 'videos');
        await fsp.mkdir(outputDir, { recursive: true });
        const finalVideoPath = path.join(outputDir, finalVideoName);
        
        await fsp.rename(tempFinalPath, finalVideoPath);

        console.log("✅ [4/5] Final video created.");
        
        res.json({
            title: parsedStoryboard.title,
            videoUrl: `/videos/${finalVideoName}`,
        });
        console.log("✅ [5/5] Sent final response to client.");

    } catch (err) {
        console.error("API Error:", err);
        res.status(500).json({ error: err.message });
    } finally {
        if (fs.existsSync(tempDir)) {
            console.log(`🧹 Cleaning up temp directory: ${tempDir}`);
            await fsp.rm(tempDir, { recursive: true, force: true }).catch(err => {
                console.error(`Error cleaning up temp directory ${tempDir}:`, err);
            });
        }
    }
});

module.exports = router;