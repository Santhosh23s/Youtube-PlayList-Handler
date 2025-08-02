const addBtn = document.getElementById('addBtn');
const videoModal = document.getElementById('videoModal');
const closeModal = document.getElementById('closeModal');
const videoForm = document.getElementById('videoForm');
const playlistContainer = document.getElementById('playlistContainer');
const modalTitle = document.getElementById('modalTitle');
const submitBtn = document.getElementById('submitBtn');

let playlists = {};
let currentEdit = null;

// Open modal in ADD mode
addBtn.onclick = () => {
  modalTitle.textContent = "Add YouTube Video";
  submitBtn.textContent = "Add";
  videoForm.reset();
  currentEdit = null;
  videoModal.classList.remove('hidden');
};

// Close modal
closeModal.onclick = () => videoModal.classList.add('hidden');

// Submit form (Add or Edit)
videoForm.onsubmit = function (e) {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const youtubeUrl = document.getElementById('youtubeUrl').value.trim();
  const playlistName = document.getElementById('playlistName').value.trim();

  if (!isValidYouTubeUrl(youtubeUrl)) {
    alert('Invalid YouTube URL');
    return;
  }

  const video = { title, description, url: youtubeUrl };

  if (currentEdit) {
    // Edit mode
    const { playlistName: pname, index } = currentEdit;
    playlists[pname][index] = video;
  } else {
    // Add mode
    if (!playlists[playlistName]) playlists[playlistName] = [];
    playlists[playlistName].push(video);
  }

  renderPlaylists();
  videoModal.classList.add('hidden');
  currentEdit = null;
};

function isValidYouTubeUrl(url) {
  const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/([\w\-]{11,})/;
  return pattern.test(url);
}

function getYouTubeID(url) {
  const regex = /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function renderPlaylists() {
  playlistContainer.innerHTML = '';
  Object.entries(playlists).forEach(([playlistName, videos]) => {
    const section = document.createElement('section');
    section.className = 'playlist';

    const titleEl = document.createElement('h3');
    titleEl.textContent = playlistName;
    section.appendChild(titleEl);

    const videoRow = document.createElement('div');
    videoRow.className = 'video-row';

    videos.forEach((video, index) => {
      const card = document.createElement('div');
      card.className = 'video-card';

      const menu = document.createElement('div');
      menu.className = 'video-menu';

      const dots = document.createElement('button');
      dots.className = 'menu-dots';
      dots.innerHTML = '&#x22EE;';

      const dropdown = document.createElement('div');
      dropdown.className = 'menu-content';

      dots.onclick = () => {
        dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
      };

      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.onclick = () => {
        // Edit Mode Setup
        currentEdit = { playlistName, index };
        document.getElementById('title').value = video.title;
        document.getElementById('description').value = video.description;
        document.getElementById('youtubeUrl').value = video.url;
        document.getElementById('playlistName').value = playlistName;

        modalTitle.textContent = "Edit YouTube Video";
        submitBtn.textContent = "Update";
        videoModal.classList.remove('hidden');
        dropdown.style.display = 'none';
      };

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.onclick = () => {
        playlists[playlistName].splice(index, 1);
        renderPlaylists();
      };

      dropdown.appendChild(editBtn);
      dropdown.appendChild(deleteBtn);
      menu.appendChild(dots);
      menu.appendChild(dropdown);
      card.appendChild(menu);

      const videoId = getYouTubeID(video.url);
      const iframeContainer = document.createElement('div');
      iframeContainer.className = 'iframe-box';

      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${videoId}`;
      iframe.allowFullscreen = true;

      iframeContainer.appendChild(iframe);
      card.appendChild(iframeContainer);

      const title = document.createElement('h4');
      title.textContent = video.title;

      const desc = document.createElement('p');
      desc.textContent = video.description;

      card.appendChild(title);
      card.appendChild(desc);

      videoRow.appendChild(card);
    });

    section.appendChild(videoRow);
    playlistContainer.appendChild(section);
  });
}
