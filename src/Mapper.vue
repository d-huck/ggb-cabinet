<template>
  <Transition name="modal">
    <div v-if="!loaded" class="modal-mask" @click="doNothing">
      <div class="modal-container">
        <div class="modal-header">
          <slot name="header">
            <span>Welcome</span>
            <XMarkIcon class="size-6 text-black-500 float-right cursor-pointer" @click="closeWelcome" />
          </slot>
        </div>
        <div class="modal-body">
          <slot name="body">This memorial works best on Desktop and contains audio. Headphones are strongly recommended and please make sure your volume is turned up.</slot>
        </div>
      </div>
    </div>
  </Transition>
  <Transition name="modal">
    <div v-if="textDialog">
      <div class="modal-wrapper modal-dim" @click="closeTextDialog">
        <div class="modal-container-large over" @click.stop="doNothing">
          <div class="modal-header">
            <slot name="header">
              <XMarkIcon class="size-6 text-black-500 float-right cursor-pointer" @click="closeTextDialog" />
            </slot>
          </div>
          <div class="modal-body" >
            <slot name="body"><div class="modal-text" v-html="textDialog"></div></slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
  <Transition name="modal">
    <div v-if="showLockedDrawerDialog">
      <div class="modal-wrapper modal-dim" @click="closeLockedDrawer">
        <div class="modal-container-large over" @click.stop="doNothing">
          <div class="modal-header">
            <slot name="header">
              <!-- TODO: This is a little ambiguous -->
              <span>The date Jen and I were married.</span>
              <XMarkIcon class="size-6 text-black-500 float-right cursor-pointer" @click="closeLockedDrawer" />
            </slot>
          </div>
          <div class="modal-body" @click.stop="doNothing">
            <slot name="body">
              <div class="w-full text-center">
                <InputMask v-model="lockedCode" class="w-50 text-center" placeholder="99/99/9999" mask="99/99/9999" slotChar="__/__/____" />
              </div>
            </slot>
          </div>
          <div class="modal-footer" @click.stop="doNothing">
            <slot name="footer">
              <button
                class="modal-default-button"
                @click="submitCode"
              >Submit</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
  <Transition name="modal-flipbook">
    <div v-if="flipbookDisplay" class="modal-wrapper modal-dim" @click="closeFlipbook">
      <div class="modal-container-media over" @click.stop="doNothing">
        <div class="modal-header">
          <slot name="header">
            <XMarkIcon class="size-6 text-black-500 float-right cursor-pointer" @click="closeFlipbook" />
          </slot>
        </div>
        <div class="modal-body" @click.stop="doNothing">
          <slot name="body">
            <div class="card">
                <Carousel
                  :value="postcards"
                  :numVisible="1"
                  :numScroll="1"
                  :responsiveOptions="carouselOptions"
                >
                    <template #item="slotProps">
                        <div class="flip-container border-surface-200 dark:border-surface-700 rounded">
                            <div class="flex mx-auto cursor-pointer">
                                <vue-flip active-click width="100%" height="600px" transition="1.0s">
                                  <template v-slot:front>
                                    <div class="flip-item w-full flex mx-auto">
                                      <img :src="slotProps.data.back" class="h-400 rounded mx-auto justify-self-center" />
                                    </div>
                                  </template>
                                  <template v-slot:back>
                                    <div class="flip-item w-full flex mx-auto">
                                      <img :src="slotProps.data.front" class="h-400 rounded mx-auto" />
                                    </div>
                                  </template>
                                </vue-flip>
                            </div>
                        </div>
                    </template>
                </Carousel>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
  <Transition name="modal">
    <div v-if="imageDisplay" class="modal-wrapper modal-dim" @click="closeImage">
      <div class="modal-container-media" @click.stop="doNothing">
        <div class="modal-header">
          <slot name="header">
            <XMarkIcon class="size-6 text-black-500 float-right cursor-pointer" @click="closeImage" />
          </slot>
        </div>
        <div class="modal-body">
          <slot name="body">
            <div class="card">
              <div class="w-full relative mx-auto">
                <img :src="imageDisplay" class="h-tall rounded mx-auto" />
              </div>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
  <Transition name="modal">
    <div v-if="soundPlaying" class="modal-wrapper modal-dim" @click.stop="closeAudio">
      <div class="modal-container-large over" @click.stop="doNothing">
        <div class="modal-header">
          <slot name="header">
            <div class="text-center">
              <span>{{soundPlaying.label}}</span>
              <XMarkIcon class="size-6 text-black-500 float-right cursor-pointer" @click.stop="closeAudio" />
            </div>
          </slot>
        </div>
        <div class="modal-body" @click.stop="doNothing">
          <slot name="body">
            <div class="w-full mx-auto">
              <audio class="mx-auto" controls autoplay :src="soundPlaying.src" preload="auto" />
            </div>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
  <Transition name="modal">
    <div v-if="videoDisplay" class="modal-wrapper modal-dim" @click="closeVideo">
      <div class="modal-container-media">
        <div class="modal-header">
          <slot name="header">
            <XMarkIcon class="size-6 text-black-500 float-right cursor-pointer" @click="closeVideo" />
          </slot>
        </div>
        <div class="modal-body" @click.stop="doNothing">
          <slot name="body">
            <div class="card">
              <VideoPlayer :options="videoOptions" />
            </div>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
  <div class="app-container" ref="container" v-if="loaded">
    <div class="app-header" ref="header" v-if="loaded">
      <h3>Jennifer Ellen Combs</h3>
      <!-- <h4>1984 - 2016</h4> -->
    </div>
    <div class="mapper-container" ref="cabinet" v-if="loaded">
      <ImageMapper
        :src="src"
        :map="map"
        :width="parentWidth"
        :imgWidth="2500"
        :parentWidth="parentWidth"
        :responsive="true"
        @click="handleImageMapClick"
        v-on:click="handleImageMapClick"
      />
    </div>
  </div>
</template>

<script>
const FADE_OUT = 500;
const FADE_IN = 50;
const MAX_LEVEL = 0.5;
import { computed, defineComponent, onMounted, ref, shallowReactive } from "vue";
import { XMarkIcon } from '@heroicons/vue/24/outline';
import Carousel from "primevue/carousel";
import InputMask  from "primevue/inputmask";
import { VueFlip } from "vue-flip";
import { useSound } from "@vueuse/sound";
import ImageMapper from "@/components/ImageMapper/ImageMapper.vue";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer.vue";
import {
  VueFlux,
  FluxCaption,
  FluxControls,
  FluxIndex,
  FluxPagination,
  FluxPreloader,
  Img,
  Book,
  Zip,
} from 'vue-flux';
import 'vue-flux/style.css';

// Sounds
import backgroundMusic from './assets/audio/background_music.m4a';
import pianoAudio from './assets/audio/just_some_chords.m4a';
import proposalAudio from './assets/audio/proposal.m4a';
import voicemailAudio from './assets/audio/voicemail.mp3';

// Drawer sounds
import drawerOpenA from './assets/audio/drawer/soundfx-open_a.mp3';
import drawerOpenB from './assets/audio/drawer/soundfx-open_b.mp3';
import drawerOpenC from './assets/audio/drawer/soundfx-open_c.mp3';

import drawerCloseA from './assets/audio/drawer/soundfx-close_a.mp3';
import drawerCloseB from './assets/audio/drawer/soundfx-close_b.mp3';
import drawerCloseC from './assets/audio/drawer/soundfx-close_c.mp3';

import drawerStuckA from './assets/audio/drawer/soundfx-stuck_a.mp3';
import drawerStuckB from './assets/audio/drawer/soundfx-stuck_b.mp3';
import drawerStuckC from './assets/audio/drawer/soundfx-stuck_c.mp3';

// Cabinet image
import cabinetImage from './assets/images/cabinet.webp';

// Letter
import letterImage from './assets/images/letter.webp';

// Postcards
import postcard1Front from './assets/images/postcards/postcard-01-front.webp';
import postcard1Back from './assets/images/postcards/postcard-01-back.webp';
import postcard2Front from './assets/images/postcards/postcard-02-front.webp';
import postcard2Back from './assets/images/postcards/postcard-02-back.webp';
import postcard3Front from './assets/images/postcards/postcard-03-front.webp';
import postcard3Back from './assets/images/postcards/postcard-03-back.webp';
import postcard4Front from './assets/images/postcards/postcard-04-front.webp';
import postcard4Back from './assets/images/postcards/postcard-04-back.webp';
import postcard5Front from './assets/images/postcards/postcard-05-front.webp';
import postcard5Back from './assets/images/postcards/postcard-05-back.webp';

import phoneVideo from './assets/video/first_date.mp4';

// Areas
import areas from './assets/areas.json';
import text from './assets/text.json';

export default defineComponent({
  components: {
    Carousel,
    ImageMapper,
    InputMask,
    VideoPlayer,
    XMarkIcon,
    'vue-flip': VueFlip
  },
  setup() {
    "Mapper";

    const loaded = ref(false);
    const src = cabinetImage;
    let areasData = ref([]);
    const map = computed(() => ({
      name: 'my-map',
      areas: areasData.value,
    }));
    const date = ref(null);
    const container = ref(null);
    onMounted(() => {
      window.addEventListener('resize', handleResize);
    });
    const parentWidth = ref(container.value?.clientWidth ?? -1);
    const handleResize = () => {
      parentWidth.value = container.value.clientWidth;
    };

    const bkLoadError = (id, err) => {
      console.log("Background sound load error", id, err);
    };

    const bkPlay = (id) => {
      console.log("Background sound playing");
    };

    const bkPlayError = (id, err) => {
      console.log("Background sound play error", id, err);
    };

    let backgroundMusicArgs = useSound(backgroundMusic, { html5: true, loop: true, onloaderror: bkLoadError, onplay: bkPlay, onplayerror: bkPlayError });
    let bgm_pos = 0;
    let drawerOpenAArgs = useSound(drawerOpenA);
    let drawerOpenBArgs = useSound(drawerOpenB);
    let drawerOpenCArgs = useSound(drawerOpenC);
    let drawerCloseAArgs = useSound(drawerCloseA);
    let drawerCloseBArgs = useSound(drawerCloseB);
    let drawerCloseCArgs = useSound(drawerCloseC);
    let drawerStuckAArgs = useSound(drawerStuckA);
    let drawerStuckBArgs = useSound(drawerStuckB);
    let drawerStuckCArgs = useSound(drawerStuckC);
    // console.log(backgroundMusicArgs);
    const sounds = {
      backgroundMusic: {
        play: backgroundMusicArgs.play,
        pause: backgroundMusicArgs.pause,
        stop: backgroundMusicArgs.stop,
        seek: backgroundMusicArgs.sound.seek,
        sound: backgroundMusicArgs.sound
      },
      pianoAudio: {
        src: pianoAudio,
        label: "Just some chords"
      },
      proposalAudio: {
        src: proposalAudio,
        label: "Proposal"
      },
      voicemailAudio: {
        src: voicemailAudio,
        label: "Please don't be mad"
      },
      drawer: {
        open: [drawerOpenAArgs.play, drawerOpenBArgs.play, drawerOpenCArgs.play],
        close: [drawerCloseAArgs.play, drawerCloseBArgs.play, drawerCloseCArgs.play],
        stuck: [drawerStuckAArgs.play, drawerStuckBArgs.play, drawerStuckCArgs.play]
      }
    };

    const textDialog = ref(null);
    const flipbookDisplay = ref(false);
    const carouselOptions = ref([{
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    }]);
    const imageDisplay = ref(null);
    const soundPlaying = ref(null);
    const videoDisplay = ref(null);
    const videoOptions = ref({});
    const showLockedDrawerDialog = ref(false);
    const lockedCode = ref("");
    const postcards = [{
      front: postcard1Front,
      back: postcard1Back
    }, {
      front: postcard2Front,
      back: postcard2Back
    }, {
      front: postcard3Front,
      back: postcard3Back
    }, {
      front: postcard4Front,
      back: postcard4Back
    }, {
      front: postcard5Front,
      back: postcard5Back
    }];

    let queryParams = new URLSearchParams("");
    if (window.location.search && (window.location.search.length > 0)) {
      let uri = window.location.search.substring(1); 
      queryParams = new URLSearchParams(uri);
    }

    const closeWelcome = () => {
      loaded.value = true;
      areasData.value = areas;
      setTimeout(() => {
        // console.log("Start background music playing");
        sounds.backgroundMusic.sound.value.level = MAX_LEVEL;
        sounds.backgroundMusic.play();
      }, 50);
    };

    const closeTextDialog = () => {
      let choice = Math.floor(Math.random()*sounds.drawer.close.length);
      sounds.drawer.close[choice]();
      textDialog.value = null;
    };

    const closeLockedDrawer = () => {
      showLockedDrawerDialog.value = false;
    };

    const closeFlipbook = () => {
      let choice = Math.floor(Math.random()*sounds.drawer.close.length);
      sounds.drawer.close[choice]();
      flipbookDisplay.value = false;
    };

    const closeImage = () => {
      let choice = Math.floor(Math.random()*sounds.drawer.close.length);
      sounds.drawer.close[choice]();
      imageDisplay.value = null;
    };

    const closeAudio = () => {
      let choice = Math.floor(Math.random()*sounds.drawer.close.length);
      sounds.drawer.close[choice]();
      soundPlaying.value = null;
      sounds.backgroundMusic.sound.value.fade(0, MAX_LEVEL, FADE_IN);
      setTimeout(() => {
        sounds.backgroundMusic.play();
      }, FADE_IN);
    };

    const closeVideo = () => {
      let choice = Math.floor(Math.random()*sounds.drawer.close.length);
      sounds.drawer.close[choice]();
      videoDisplay.value = null;
      videoOptions.value = {};
      sounds.backgroundMusic.sound.value.fade(0, MAX_LEVEL, FADE_IN);
      setTimeout(() => {
        sounds.backgroundMusic.play();
      }, FADE_IN);
      // sounds.backgroundMusic.play();
    };

    const doNothing = () => {
      // Do nothing
    };

    const parseDate = () => {
      console.log("Parsing date");
        let uri = window.location.search.substring(1); 
        let params = new URLSearchParams(uri);
        let dateTime = params.get("d") ?? "";
        // window.history.replaceState({}, document.title, window.location.pathname);
        // console.log("params:", params.toString());
        // console.log("Datetime:", dateTime);
        if (dateTime.length > 0) {
          let date_obj = new Date(
            dateTime.substring(0, 4) + "-" +
            dateTime.substring(4, 6) + "-" +
            dateTime.substring(6, 8) + "T" +
            dateTime.substring(8, 10) + ":" +
            dateTime.substring(10, 12) + ":00"
          );
          let formatted_date = `${date_obj.toLocaleDateString('en-US', {weekday: 'long'})}, ${date_obj.toLocaleDateString('en-US', {month: 'long'})} ${date_obj.getDate()}, ${date_obj.getFullYear()} at ${date_obj.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})}`;
          console.log("formatted date:", formatted_date);
          date.value = formatted_date;
        } else if (!date.value) {
          date.value = null;
        }
        console.log("Date value:", date.value);
    }
    parseDate();

    const submitCode = () => {
      //let lockedCode = lockedCode1.value + "/" + lockedCode2.value + "/" + lockedCode3.value;
      if (lockedCode.value === text["date"]) {
        console.log("Locked code:", lockedCode.value);
        let choice = Math.floor(Math.random()*sounds.drawer.open.length);
        sounds.drawer.open[choice]();
        showLockedDrawerDialog.value = false;
        if (date.value) {
          textDialog.value = text["10-protected"];
        } else {
          textDialog.value = text["10-public"];
        }
      }
    };

    const getText = (key) => {
      console.log("Getting text for key:", key);
      console.log("Text:", text[key]);
      return text[key];
    };

    const handleImageMapClick = (area, index, event) => {
      // console.log(area, index);
      let choice = Math.floor(Math.random()*sounds.drawer.open.length);
      if (area.name === "10") {
        sounds.drawer.stuck[choice]();
      } else if (area.name) {
        sounds.drawer.open[choice]();
      } 


      
      switch (area.name) {
        case "40":
          soundPlaying.value = sounds.pianoAudio;
          sounds.backgroundMusic.sound.value.fade(MAX_LEVEL, 0, FADE_OUT);
          setTimeout(() => {
            sounds.backgroundMusic.pause();
          }, FADE_OUT);
          bgm_pos = sounds.backgroundMusic.sound.value.seek();
          break;
        case "6":
          sounds.backgroundMusic.sound.value.fade(MAX_LEVEL, 0, FADE_OUT);
          setTimeout(() => {
            sounds.backgroundMusic.pause();
          }, FADE_OUT);
          bgm_pos = sounds.backgroundMusic.sound.value.seek();
          videoDisplay.value = phoneVideo;
          videoOptions.value = {
            autoplay: true,
            controls: true,
            sources: [{
              src: phoneVideo,
              type: 'video/mp4'
            }]
          };
          break;
        case "9":
          flipbookDisplay.value = true;
          break;
        case "10":
            lockedCode.value = "";
            showLockedDrawerDialog.value = true;
          break;
        case "14":
          soundPlaying.value = sounds.proposalAudio;
          sounds.backgroundMusic.sound.value.fade(MAX_LEVEL, 0, FADE_OUT);
          setTimeout(() => {
            sounds.backgroundMusic.pause();
          }, FADE_OUT);
          bgm_pos = sounds.backgroundMusic.sound.value.seek();
          break;
        case "16":
          imageDisplay.value = letterImage;
          break;
        case "20":
          soundPlaying.value = sounds.voicemailAudio;
          sounds.backgroundMusic.sound.value.fade(MAX_LEVEL, 0, FADE_OUT);
          setTimeout(() => {
            sounds.backgroundMusic.pause();
          }, FADE_OUT);
          bgm_pos = sounds.backgroundMusic.sound.value.seek();
          break;
        default:
          textDialog.value = getText(area.name);
          break;
      }
    };

    return {
      loaded,
      map,
      src,
      container,
      parentWidth,
      sounds,
      closeWelcome,
      closeTextDialog,
      closeLockedDrawer,
      closeFlipbook,
      closeImage,
      closeAudio,
      closeVideo,
      textDialog,
      flipbookDisplay,
      postcards,
      carouselOptions,
      imageDisplay,
      soundPlaying,
      videoDisplay,
      videoOptions,
      showLockedDrawerDialog,
      doNothing,
      submitCode,
      lockedCode,
      handleImageMapClick,
    };
  }
});
</script>

<style>
@font-face {
  font-family: "Typewriter";
  font-style: normal;
  font-weight: normal;
  src: url("./fonts/jmh_typewriter.ttf") format("truetype");
}

@font-face {
  font-family: "Typewriter";
  font-style: normal;
  font-weight: bold;
  src: url("./fonts/jmh_typewriter_bold.ttf") format("truetype");
}

@font-face {
  font-family: "Aston";
  font-style: normal;
  font-weight: normal;
  src: url("./fonts/aston.ttf") format("truetype");
}

body {
  color: black;
  background-color: white;
  /* background-color: #465a4c; */
  /* background-color: #f3e3b2; */
  /* background-color: #8f950b;  */
  background-color: #6f7502;
  /* background-color: #5f6501; */
  /* background-color: #3e8b43; */
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.99);
  display: flex;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: scroll;
  z-index: 1000;
}
.modal-dim {
  background-color: rgba(0, 0, 0, 0.85);
  transition: opacity 0.3s ease;
}

.modal-container {
  width: 300px;
}

@media only screen and (max-width: 640px) {
  .modal-container-large {
    width: 100%;
    height: 100%;
  }
  .modal-body {
    height: 100%;
    overflow-y: scroll;
    padding-bottom: 20px;
  }
  .modal-container-media {
    width: 100%;
    height: 100%;
  }
  .w-50 {
    width: 100%;
  }
}

@media only screen and (min-width: 641px) {
  .modal-container-large {
    width: 60%;
  }
  .modal-body {
    height: 100%;
    overflow-y: scroll;
    padding-bottom: 20px;
  }
  .modal-container-media {
    width: 80%;
  }
  .w-50 {
    width: 50%;
  }
}

@media only screen and (min-width: 1024px) {
  .modal-container-media {
    width: 60%;
  }
  .modal-container-large {
    width: 45%;
  }
}

@media only screen and (min-width: 1600px) {
  .modal-container-media {
    width: 45%;
  }
  .modal-container-large {
    width: 35%;
  }
}


.modal-container-large {
  position: absolute;
  z-index: 1000;
}

.modal-container,
.modal-container-media,
.modal-container-large {
  margin: auto;
  padding: 20px 30px;
  background-color: #f3e3b2;
  font-family: 'Typewriter', 'Courier New', Courier, monospace;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}
.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}
.modal-body {
  margin: 20px 20px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.modal-default-button {
  float: right;
}
.modal-image .modal-body img {
  width: 100%;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */
.modal-enter-from,
.modal-flipbook-enter-from {
  opacity: 0;
}
.modal-leave-to,
.modal-flipbook-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-container,
.modal-flipbook-enter-from .modal-container,
.modal-leave-to .modal-container,
.modal-flipbook-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

h3, h4 {
    font-family: 'Typewriter', 'Courier New', Courier, monospace;
  }
.mapper-container {
  width: 100%;
  height: 100%;
}

@media only screen and (max-width: 720px) {
  .app-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    margin-top: 20px;
    width: 98%;
    height: 100%;
    justify-items: flex-start;
  }
  h3 {
    font-size: 2.5rem !important;
  }
  h4 {
    font-size: 1rem !important;
  }
}

@media only screen and (min-width: 721px) {
  .app-container {
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
    max-width: 95vh;
    max-height: 90vw;
    width: 98vw;
    height: 95vh;
    margin: auto;
    margin-top: 2.5vh;
    margin-bottom: 2.5vh;
  }

  .flip-container {
    margin: auto;
    height: 640px;
    justify-content: center;
    align-items: center;
  }
  h3 {
    font-size: 2.5rem !important;
    font-weight: bold;
    padding-bottom: 1vh;
    align-items: center;
  }
  h4 {
    font-size: 2rem !important;
    align-items: center;
  }
}
.app-header {
  margin-top: 2.5vh;
}
.app-header h3 {
  font-family: 'Aston', 'Brush Script MT', cursive;
  color: #000;
  text-align: center;
}

.app-header h3 {
  padding-top: 1vh;
  padding-bottom: 28px;
}

.app-header h4 {
  padding-top: 0px;
  padding-bottom: 1vh;
  text-align: center;;
}

.flip-item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.mx-auto {
  margin: 0 auto;
}
@media only screen and (min-height: 360px) {
  .h-tall {
    height: initial;
    max-height: 300px;
  }
}
@media only screen and (min-height: 600px) {
  .h-tall {
    height: initial;
    max-height: 540px;
  }
}
@media only screen and (min-height: 720px) {
  .h-tall {
    height: initial;
    max-height: 660px;
  }
}
@media only screen and (min-height: 1080px) {
  .h-tall {
    height: initial;
    max-height: 1000px;
  }
}
.h-400 {
  max-height: 400px;
  height: initial;
}
.h-400 {
  max-height: 600px;
  height: initial;
}
</style>