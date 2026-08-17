/* ==========================================================================
   ONLYFANS REALISTIC INTERACTION CONTROLLER
   Full functionality for all buttons, content-unlock triggers, fullscreen reveal and voice audio
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const ofSplashScreen = document.getElementById("ofSplashScreen");
  const ofLoadingModal = document.getElementById("ofLoadingModal");
  const fullscreenRevealModal = document.getElementById("fullscreenRevealModal");
  const fullscreenCloseBtn = document.getElementById("fullscreenCloseBtn");
  const prankAudio = document.getElementById("prankAudio");
  const ofToast = document.getElementById("ofToast");

  // 0. ONLYFANS INITIAL SPLASH SCREEN DISMISS (850ms realistic loading)
  if (ofSplashScreen) {
    setTimeout(() => {
      ofSplashScreen.classList.add("fade-out");
      setTimeout(() => {
        ofSplashScreen.style.display = "none";
      }, 450);
    }, 850);
  }

  // Show temporary toast message
  function showToast(msg) {
    if (!ofToast) return;
    ofToast.innerText = msg;
    ofToast.classList.add("show");
    setTimeout(() => {
      ofToast.classList.remove("show");
    }, 2200);
  }

  // 1. TRIGGER REVEAL (Plays voice recording right when image pops up)
  function triggerFullscreenReveal() {
    // Step 1: Quick native loading spinner (0.35s)
    ofLoadingModal.classList.add("active");

    // Step 2: Fullscreen image takeover + Audio playback
    setTimeout(() => {
      ofLoadingModal.classList.remove("active");
      fullscreenRevealModal.classList.add("active");

      // Play prank voice recording
      if (prankAudio) {
        prankAudio.currentTime = 0;
        const playPromise = prankAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.log("Audio playback:", err);
          });
        }
      }
    }, 380);
  }

  const revealTriggers = document.querySelectorAll(".trigger-reveal");
  revealTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Pre-unlock audio on user tap to satisfy mobile browser autoplay policies
      if (prankAudio) {
        prankAudio.load();
      }

      triggerFullscreenReveal();
    });
  });

  // Close Fullscreen Image Takeover
  function closeFullscreen() {
    fullscreenRevealModal.classList.remove("active");
    if (prankAudio) {
      prankAudio.pause();
      prankAudio.currentTime = 0;
    }
  }

  if (fullscreenCloseBtn) {
    fullscreenCloseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeFullscreen();
    });
  }

  if (fullscreenRevealModal) {
    fullscreenRevealModal.addEventListener("click", () => {
      closeFullscreen();
    });
  }

  // 2. LIKE BUTTONS (Interactive toggle + counter increment/decrement)
  const likeButtons = document.querySelectorAll(".like-btn");
  likeButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const isLiked = btn.classList.toggle("liked");
      const postCard = btn.closest(".of-feed-post");
      const likeNumSpan = postCard ? postCard.querySelector(".like-number") : null;
      
      if (likeNumSpan) {
        let currentLikes = parseInt(btn.dataset.likes, 10) || 584;
        if (isLiked) {
          likeNumSpan.innerText = (currentLikes + 1).toLocaleString();
        } else {
          likeNumSpan.innerText = currentLikes.toLocaleString();
        }
      }
    });
  });

  // 3. BOOKMARK BUTTONS (Interactive toggle)
  const bookmarkButtons = document.querySelectorAll(".bookmark-btn");
  bookmarkButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.toggle("bookmarked");
    });
  });

  // 4. COMMENT BUTTONS (Shows realistic restriction notice)
  const commentButtons = document.querySelectorAll(".comment-btn");
  commentButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      showToast("Comentariile sunt disponibile doar abonaților");
    });
  });

  // 5. SHARE BUTTONS (Copies link to clipboard & shows toast)
  function handleShare(e) {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast("Link copiat în clipboard");
      }).catch(() => {
        showToast("Link copiat în clipboard");
      });
    } else {
      showToast("Link copiat în clipboard");
    }
  }

  const headerShareBtn = document.getElementById("headerShareBtn");
  const profileShareBtn = document.getElementById("profileShareBtn");
  if (headerShareBtn) headerShareBtn.addEventListener("click", handleShare);
  if (profileShareBtn) profileShareBtn.addEventListener("click", handleShare);

  // 6. TABS SWITCHING (24 POSTS / 52 MEDIA)
  const tabPostsBtn = document.getElementById("tabPostsBtn");
  const tabMediaBtn = document.getElementById("tabMediaBtn");
  const postsView = document.getElementById("postsView");
  const mediaView = document.getElementById("mediaView");

  if (tabPostsBtn && tabMediaBtn && postsView && mediaView) {
    tabPostsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      tabPostsBtn.classList.add("active");
      tabMediaBtn.classList.remove("active");
      postsView.style.display = "block";
      mediaView.style.display = "none";
    });

    tabMediaBtn.addEventListener("click", (e) => {
      e.preventDefault();
      tabMediaBtn.classList.add("active");
      tabPostsBtn.classList.remove("active");
      postsView.style.display = "none";
      mediaView.style.display = "block";
    });
  }

  // 7. MEDIA SUB-FILTER BUTTONS (ALL / PHOTOS / VIDEOS)
  const mediaFilterBtns = document.querySelectorAll(".media-filter-btn");
  mediaFilterBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      mediaFilterBtns.forEach((f) => f.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // 8. BOTTOM NAVIGATION ACTIVE STATE
  const bottomNavItems = document.querySelectorAll(".b-nav-item");
  bottomNavItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      bottomNavItems.forEach((nav) => nav.classList.remove("active"));
      item.classList.add("active");
    });
  });
});
