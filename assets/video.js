function generateVideoSrc(videoLink, videoType) {
  let videoId = '';
  let videoSrc = '';

  if (videoLink.includes('youtu.be')) {
    videoId = videoLink.split('youtu.be/')[1];
  } else {
    videoId = videoLink.split('v=')[1];
  }

  if (videoType == 'youtube') {
    videoSrc = 'https://www.youtube.com/embed/' + videoId;
  } else if (videoType == 'facebook') {
    videoSrc = `https://www.facebook.com/plugins/video.php?href=${videoLink}`;
  }

  return videoSrc;
}

const videoSrc = generateVideoSrc(videoLink, videoType);

if (videoType == 'youtube') {
  const iframe = document.getElementById('youtube-video');
  iframe.src = videoSrc;
  iframe.width = width;
} else if (videoType == 'facebook') {
  const iframe = document.getElementById('facebook-video');
  iframe.src = videoSrc;
  iframe.width = width;
}


function getBestThumbnailUrl(videoId) {
  return new Promise((resolve) => {
    const img = new Image();
    const maxResUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

    img.onload = () => {
      resolve(maxResUrl);
    };

    img.onerror = () => {
      resolve(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);
    };

    img.src = maxResUrl;
  });
}


function extractYouTubeVideoId(url) {
  const regex = /(?:v=|youtu\.be\/)([^&]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

const videoId = extractYouTubeVideoId(videoLink);

document.addEventListener('DOMContentLoaded', async function () {
  const youtubeVideo = document.getElementById('youtube-video');
  if (youtubeVideo) {
    youtubeVideo.style.width = width + 'px';
    youtubeVideo.style.height = height + 'px';
    const videoLink = youtubeVideo.dataset.videoLink;
    const youtubeThumbnail = youtubeVideo.querySelector('.youtube-thumbnail');
    const youtubePlayButton = youtubeVideo.querySelector('.youtube-play-button');

    // Use the new function to get the best thumbnail URL
    const thumbnailUrl = await getBestThumbnailUrl(videoId);
    youtubeThumbnail.src = thumbnailUrl;

    const iframe = document.createElement('iframe');
    iframe.width = width;
    iframe.height = height;
    iframe.src = '';
    iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.style.display = 'none';

    youtubeVideo.appendChild(iframe);

    youtubeVideo.addEventListener('click', function () {
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&origin=${encodeURIComponent(window.location.origin)}`;
      iframe.style.display = 'block';
      youtubeThumbnail.style.display = 'none';
      youtubePlayButton.style.display = 'none'; // Hide the play button when video starts playing
    });
  }
});
