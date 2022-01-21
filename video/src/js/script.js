let videoParams = {
    "id": "rb_video",
    "ratioX": 9,
    "ratioY": 16,
    "ratioReverse": false,
    "scale": 18
}

window.onload = function() {
    let rbContainer = document.getElementById(videoParams["id"]);
    initVideo(rbContainer);
}

function initVideo(rbContainer) {
    if (removeVideo(rbContainer)) return;

    let rbVideoBlock = rbContainer.getElementsByClassName('rb_video')[0];
    let rbVideo = rbContainer.querySelector('#video');
    let rbVideoBtn = rbContainer.getElementsByClassName('rb_video_btn')[0];
    let rbVideoControl = rbContainer.getElementsByClassName('rb_video_control')[0];
    let rbVideoCollapse = rbContainer.getElementsByClassName('rb_video_collapse')[0];
    let rbVideoClose = rbContainer.getElementsByClassName('rb_video_close')[0];

    resizeVideo(rbContainer, videoParams);
    showElem(rbVideoBtn, false);
    showElem(rbVideoCollapse, false);

    rbVideoControl.addEventListener('click', function () {
        videoControl(rbContainer, rbVideoBtn, rbVideoCollapse, rbVideoClose, rbVideo);
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

    setStylesOnElement(rbVideoBlock, "position: absolute; width: 100%; height: 100%; z-index: "+1);
    setStylesOnElement(rbVideoControl, "position: absolute; width: 100%; height: 100%; z-index: "+2);
    setStylesOnElement(rbVideo, "width: 100%");
}

function videoControl(rbContainer, rbVideoBtn, rbVideoCollapse, rbVideoClose, video) {
    let isActive = rbContainer.classList.contains('active');
    let activeBtn = isActive && paused(video);

    showElem(rbVideoBtn, activeBtn);
    muted(video);

    isActive = addActiveClass(rbContainer);
    showElem(rbVideoCollapse, isActive);
    showElem(rbVideoClose, !isActive);
}

function paused(video) {
    if(video.paused) {
        video.play();
    } else {
        video.pause();
    }

    return video.paused;
}

function muted(video) {
    if (video.muted) {
        video.muted = false;
    }

    return video.muted;
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