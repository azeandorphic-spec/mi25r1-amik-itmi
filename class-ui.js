const galleryImages = [...document.querySelectorAll('.class-gallery img')];
const photoViewer = document.getElementById('photoViewer');

if (galleryImages.length && photoViewer) {
  const viewerImage = document.getElementById('photoViewerImage');
  const photoCounter = document.getElementById('photoCounter');
  const photoCaption = document.getElementById('photoCaption');
  const closeButton = document.getElementById('closePhotoViewer');
  let activeImageIndex = 0;
  let lastTrigger = null;

  const showPhoto = (index) => {
    activeImageIndex = (index + galleryImages.length) % galleryImages.length;
    const image = galleryImages[activeImageIndex];
    viewerImage.src = image.src;
    viewerImage.alt = image.alt;
    photoCaption.textContent = image.alt;
    photoCounter.textContent = `${activeImageIndex + 1} / ${galleryImages.length}`;
  };

  galleryImages.forEach((image, index) => {
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', `Buka ${image.alt}`);
    image.addEventListener('click', () => {
      lastTrigger = image;
      showPhoto(index);
      photoViewer.showModal();
      closeButton.focus();
    });
    image.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        image.click();
      }
    });
  });

  document.getElementById('previousPhoto').addEventListener('click', () => showPhoto(activeImageIndex - 1));
  document.getElementById('nextPhoto').addEventListener('click', () => showPhoto(activeImageIndex + 1));
  closeButton.addEventListener('click', () => photoViewer.close());
  photoViewer.addEventListener('click', (event) => {
    if (event.target === photoViewer) photoViewer.close();
  });
  photoViewer.addEventListener('close', () => lastTrigger?.focus());
  photoViewer.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showPhoto(activeImageIndex - 1);
    if (event.key === 'ArrowRight') showPhoto(activeImageIndex + 1);
  });
}

const revealSections = document.querySelectorAll('.class-section');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealSections.forEach((section) => {
    section.classList.add('will-reveal');
    revealObserver.observe(section);
  });
} else {
  revealSections.forEach((section) => section.classList.add('is-visible'));
}
