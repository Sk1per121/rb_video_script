let player;

let youtubeParams = {
    "id": "rb_youtube",
    "ratioX": 16,
    "ratioY": 9,
    "ratioReverse": false,
    "scale": 18
}

window.onload = function() {
    loadYoutubeAPI();
}

function onYouTubeIframeAPIReady() {
    let youtube = document.getElementById(youtubeParams["id"]);
    let videoId = youtube.querySelector('#youtube').getAttribute('data-id-video');

    player = new YT.Player('youtube', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
            autoplay: 1,
            loop: 1,
            mute: 1,
            rel: 0,
            ecver: 2,
            playlist: videoId,
            controls: 0,
            showinfo: 0,
            autohide: 1,
            modestbranding: 1
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    let rbContainer = document.getElementById(youtubeParams["id"]);
    initYoutube(rbContainer, event.target);
}

function loadYoutubeAPI() {
    let tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";

    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function initYoutube(rbContainer, youtubeController) {
    if (removeVideo(rbContainer)) return;

    let rbVideoBlock = rbContainer.getElementsByClassName('rb_video')[0];
    let rbVideoBtn = rbContainer.getElementsByClassName('rb_video_btn')[0];
    let rbVideoControl = rbContainer.getElementsByClassName('rb_video_control')[0];
    let rbVideoCollapse = rbContainer.getElementsByClassName('rb_video_collapse')[0];
    let rbVideoClose = rbContainer.getElementsByClassName('rb_video_close')[0];

    resizeVideo(rbContainer, youtubeParams);
    showElem(rbVideoBtn, false);
    showElem(rbVideoCollapse, false);

    rbVideoControl.addEventListener('click', function () {
        youtubeControl(rbContainer, rbVideoBtn, rbVideoCollapse, rbVideoClose, youtubeController);
    });

    rbVideoClose.addEventListener('click', function () {
        rbContainer.remove();
        document.cookie = "close_" + rbContainer.id + "=true;max-age=86400";
    });

    rbVideoCollapse.addEventListener('click', function () {
        removeActiveClass(rbContainer);
        showElem(rbVideoBtn, false);
        showElem(rbVideoCollapse, false);
        showElem(rbVideoClose, true);
    });

    setStylesOnElement(rbVideoBlock, "position: absolute; width: 100%; height: 100%;; z-index: 1001");
    setStylesOnElement(rbVideoControl, "position: absolute; width: 100%; height: 100%;; z-index: 1002");
}

function youtubeControl(rbContainer, rbVideoBtn, rbVideoCollapse, rbVideoClose, video) {
    let isActive = rbContainer.classList.contains('active');
    let activeBtn = isActive && youtubePaused(video);

    showElem(rbVideoBtn, activeBtn);

    youtubeMuted(video);

    isActive = addActiveClass(rbContainer);
    showElem(rbVideoCollapse, isActive);
    showElem(rbVideoClose, !isActive);
}

function youtubePaused(video) {
    let play;
    if(video.getPlayerState() === 1) {
        video.pauseVideo();
        play = true;
    }

    if(video.getPlayerState() === 2) {
        video.playVideo();
        play = false;
    }

    return play;
}

function youtubeMuted(video) {
    if(video.isMuted()) {
        video.unMute();
    }

    return video.isMuted();
}

function showElem(rbVideoBtn, active) {
    if(active) {
        rbVideoBtn.style.display = 'block';
    } else {
        rbVideoBtn.style.display = 'none';
    }
}

function removeVideo(rbContainer) {
    let isDeleteBlock = false;
    let reg = new RegExp('(?:^|\s)' + 'close_'+rbContainer.id+'=(.*?)(?:;|$)');
    if(Boolean(document.cookie.match(reg))) {
        rbContainer.remove();
        isDeleteBlock = true;
    }
    return isDeleteBlock;
}

function resizeVideo(rbContainer, params) {
    let scale = params.scale;
    let ratio = params.ratioReverse ? [params.ratioY, params.ratioX] : [params.ratioX, params.ratioY];

    rbContainer.style.width = 'min('+ratio[0]*scale+'px, '+ratio[0]*3+'vw)';
    rbContainer.style.height = 'min('+ratio[1]*scale+'px, '+ratio[1]*3+'vw)';
}

function removeActiveClass(elems, activeClass="active") {
    elems = Array.isArray(elems) ? elems : [elems];
    elems.forEach(function (elem) {
        if(elem.classList.contains(activeClass)) {
            elem.classList.remove(activeClass);
        }
    });

    return false;
}

function addActiveClass(elems, activeClass="active") {
    elems = Array.isArray(elems) ? elems : [elems];
    elems.forEach(function (elem) {
        if (!elem.classList.contains(activeClass)) {
            elem.classList.add(activeClass);
        }
    });

    return true;
}

function setStylesOnElement(element, styles) {
    element.style.cssText = styles;
}