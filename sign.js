const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d', { alpha: true });
const audio = document.getElementById('myAudio');
const startScreen = document.getElementById('startScreen');
const stopBtn = document.getElementById('stopBtn');

let audioContext, analyser, dataArray, source;
let isInitialized = false;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function initAudio() {
    if (isInitialized) return;
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    audio.play();
    isInitialized = true;
    startScreen.style.display = 'none';
    stopBtn.style.display = 'inline-block';
    draw();
}

startScreen.addEventListener('click', initAudio);

stopBtn.addEventListener('click', () => {
    if (audio.paused) { 
        audio.play(); 
        stopBtn.innerText = "STOP MUSIC"; 
    } else { 
        audio.pause(); 
        stopBtn.innerText = "PLAY MUSIC"; 
    }
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerY = canvas.height / 2;
    ctx.beginPath();
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ffff00';

    // If music is playing, use the audio data
    if (isInitialized && !audio.paused) {
        analyser.getByteTimeDomainData(dataArray);
        const sliceWidth = canvas.width / dataArray.length;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * centerY;
            
            // Random micro-jitter only while music plays
            const jitter = (Math.random() - 0.5) * 30;

            if (i === 0) ctx.moveTo(x, y + jitter);
            else ctx.lineTo(x, y + jitter);
            x += sliceWidth;
        }
    } else {
        // --- THE "DIE" STATE ---
        // When stopped, we draw a perfectly flat line across the center
        ctx.moveTo(0, centerY);
        ctx.lineTo(canvas.width, centerY);
        
        // Optional: Reduce the glow when the signal is "dead"
        ctx.shadowBlur = 5; 
    }

    ctx.stroke();
    requestAnimationFrame(draw);
}

draw();