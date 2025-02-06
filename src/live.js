const video = document.querySelector('#video');
const videoSrc = 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8';

if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(videoSrc);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function() {
        video.play();
    });
} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    // This will play HLS in Safari
    video.src = videoSrc;
    video.addEventListener('loadedmetadata', function() {
        video.play();
    });
}else {
    console.error("HLS not supported in your browser.");
}