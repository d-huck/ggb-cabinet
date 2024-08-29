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
          <slot name="body">Desktop use and headphones are strongly recommended. Please ensure your volume is turned up.</slot>
        </div>
      </div>
    </div>
  </Transition>
  <Transition name="modal">
    <div v-if="textDialog">
      <div class="modal-wrapper modal-dim" @click="closeTextDialog">
        <div class="modal-container-large over">
          <div class="modal-header">
            <slot name="header">
              <XMarkIcon class="size-6 text-black-500 float-right cursor-pointer" @click="closeTextDialog" />
            </slot>
          </div>
          <div class="modal-body">
            <slot name="body"><div v-html="textDialog"></div></slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
  <Transition name="modal">
    <div v-if="showLockedDrawerDialog">
      <div class="modal-wrapper modal-dim" @click="closeLockedDrawer">
        <div class="modal-container-large over">
          <div class="modal-header">
            <slot name="header">
              <span>Our Wedding Anniversary</span>
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
      <div class="modal-container-large">
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
                        <div class="border border-surface-200 dark:border-surface-700 rounded m-2 p-4">
                            <div class="relative mx-auto cursor-pointer">
                                <vue-flip active-click width="100%" height="400px" transition="1.0s">
                                  <template v-slot:front>
                                    <div class="w-full relative mx-auto">
                                      <img :src="slotProps.data.back" class="h-400 rounded mx-auto" />
                                    </div>
                                  </template>
                                  <template v-slot:back>
                                    <div class="w-full relative mx-auto">
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
      <div class="modal-container-large">
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
      <div class="modal-container-large">
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
      <div class="modal-container-large">
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
      <h3>Virginia Combs</h3>
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

//fonts
import typewriter from './assets/fonts/typewriter.ttf';

// Sounds
import backgroundMusic from './assets/audio/background_music.m4a';
import pianoAudio from './assets/audio/just_some_chords.m4a';
import proposalAudio from './assets/audio/proposal.mp3';
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
import cabinetImage from './assets/images/cabinet2.jpg';

// Letter
import letterImage from './assets/images/letter.png';

// Postcards
import postcard1Front from './assets/images/postcards/postcard 1 front.png';
import postcard1Back from './assets/images/postcards/postcard 1 back.png';
import postcard2Front from './assets/images/postcards/postcard 2 front.png';
import postcard2Back from './assets/images/postcards/postcard 2 back.png';
import postcard3Front from './assets/images/postcards/postcard 3 front.png';
import postcard3Back from './assets/images/postcards/postcard 3 back.png';
import postcard4Front from './assets/images/postcards/postcard 4 front.png';
import postcard4Back from './assets/images/postcards/postcard 4 back.png';
import postcard5Front from './assets/images/postcards/postcard-05-front.png';
import postcard5Back from './assets/images/postcards/postcard-05-back.png';

import phoneVideo from './assets/video/PXL_20240713_164815821.mp4';

// Areas
import areas from './assets/areas.json';

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
    const container = ref(null);
    onMounted(() => {
      window.addEventListener('resize', handleResize);
    });
    const parentWidth = ref(800);
    const handleResize = () => {
      console.log("Resizing to", container.value.clientWidth);
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
        label: "Voicemail"
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
      setTimeout(() => {
        // console.log("Start background music playing");
        sounds.backgroundMusic.sound.value.level = MAX_LEVEL;
        sounds.backgroundMusic.play();
        handleResize();
        setTimeout(() => {
          // console.log("Setting image map areas");
          areasData.value = areas;
        }, 50);
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

    const submitCode = () => {
      //let lockedCode = lockedCode1.value + "/" + lockedCode2.value + "/" + lockedCode3.value;
      if (
        (lockedCode.value === "04/15/2015") ||
        (lockedCode.value === "4/15/2015") ||
        (lockedCode.value === "04/15/15") ||
        (lockedCode.value === "4/15/15")
      ) {
        let phone = "";
        let address = "";
        let uri = window.location.search.substring(1); 
        // console.log("Search", window.location.search);
        let params = new URLSearchParams(uri);
        let dateTime = params.get("d") ?? "";
        // console.log("Params", params, dateTime);
        if (dateTime.length > 0) {
          let hours = parseInt(dateTime.substring(8, 10));
          let ampm = "AM";
          if (hours >= 12) {
            ampm = "PM";
            if (hours > 12) {
              hours -= 12;
            }
          }
          dateTime = dateTime.substring(4, 6) + "/" + dateTime.substring(6, 8) + "/" + dateTime.substring(0, 4) +
            " at " + String(hours) + ":" + dateTime.substring(10, 12) + " " + ampm;
        }
        showLockedDrawerDialog.value = false;
        textDialog.value = `&#8220;Emily,<br>
        <br>
        If you&#8217;re reading this, then it&#8217;s likely you haven&#8217;t heard from me in a little while. I left something for you in my camper that I hope will explain things. Call ${phone} when you arrive at ${address} and someone will meet you there on ${dateTime} to let you in. Don&#8217;t be late.<br>
        <br>
        -Henry&#8221;`;
        let choice = Math.floor(Math.random()*sounds.drawer.open.length);
        sounds.drawer.open[choice]();
      } else {
        showLockedDrawerDialog.value = false;
        let choice = Math.floor(Math.random()*sounds.drawer.stuck.length);
        sounds.drawer.stuck[choice]();
      }
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
        case "1":
          textDialog.value = `Jen was naturally gifted at virtually every art form she ever touched, but she refused to call herself an artist because &#8220;artists actually finish projects.&#8221; She would tell people she was a dilettante at best and laugh, but I knew it was a sore spot for her. I asked her once why she didn&#8217;t finish her projects, and she said it was because the thing she made was never as pure as the idea of it, so she would chase the idea until it stopped being real. At some point, she would inevitably feel frustrated and abandon her work.<br>
          <br>
          The one exception to this was the graphic novel she had been slowly, secretly working on for five years. It was easily the longest she had ever stuck with a project, but progress was slow because &#8220;the true form kept changing.&#8221; So she would begin again and again. Instead of feeling frustrated, it was a self-renewing source of discovery. The point was not to finish, but to capture the truer, deeper cut as it emerged in the moment. It was only ever meant for her. I wish I knew what it was even about, but it&#8217;s all lost to the flood.`;
          break;
        case "2":
          textDialog.value = `On days when Jen was too depressed to get out of bed, I would stay in bed with her and make up these dumb little stories that she called &#8220;can&#8217;t-get-out-of-bed-time stories.&#8221; Honestly, I would just say whatever nonsense popped into my head to try to make her laugh. We would do that for hours sometimes, me just holding her or playing with her hair as she drifted in and out of consciousness. I would give anything for even just one of our worst days together again.`;
          break;
        case "40":
          soundPlaying.value = sounds.pianoAudio;
          sounds.backgroundMusic.sound.value.fade(MAX_LEVEL, 0, FADE_OUT);
          setTimeout(() => {
            sounds.backgroundMusic.pause();
          }, FADE_OUT);
          bgm_pos = sounds.backgroundMusic.sound.value.seek();
          break;
        case "4":
          textDialog.value = `I remember Jen telling me about a strange experience she had as a girl. She remembers playing in her room&mdash;in this 90-year-old farmhouse and seeing a teenage girl in strange old clothing watching her with curiosity. She felt excited to have the undivided attention of someone older than her. She ran to show her mom the girl, but when they returned, she was nowhere. Jen told me that she was so desperate for attention, she began to imagine that the girl was watching her with great interest all of the time, even though she only occasionally saw her.  Making her bed or brushing her teeth was now an event worthy of an audience. Jen named the girl &#8220;Chrissy&#8221; and talked to her constantly. Her parents and teachers just assumed this was an imaginary friend of hers and that she would eventually outgrow it. Jen was 11 or 12 when it first occurred to her that Chrissy was a dead person. The feeling of being watched changed after that. She stopped talking to or acknowledging Chrissy altogether. She said she&#8217;s never told anyone about that before, but it&#8217;s part of the reason she doesn&#8217;t like going back home. The other part was her parents. Maybe it was the power of suggestion, but sleeping in her childhood bedroom, I felt it too. I never told her that. I don&#8217;t know why.`;
          break;
        case "5":
          textDialog.value = `I remember waiting for the moment I would do or say something too weird or vulnerable and she would recoil and slink away. Everyone who had ever tried to love me eventually realized that they couldn&#8217;t for reasons I and possibly they will never fully understand.<br>
          <br>
          When she saw the MRE stockpile and go bag in the camper, she asked me if I was a prepper. I explained to her that I was prepping for climate change and the societal collapse that follows. I kept thinking to myself: this is it. This is how I lose her. But she just listened. She never ridiculed me or told me I was overreacting.`;
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
        case "7":
          textDialog.value = `I came home one day to find Jen staring at a wall and unresponsive. When I touched her arm, she flinched. I thought something terrible had happened, and in a way it had, but it was the slow, wearing down of a person, rather than any single thing. She worked for a company that exclusively catered events for the super wealthy. The tips were great and for a little while, Jen thought the stories of people placing chewed up gum in her hand or offering her $10k to sleep with them were almost funny.<br>
          <br>
          But once the novelty wore off, it was completely demoralizing. She stopped creating and she had frequent night terrors. I told her to just quit and that I could float us both for a little while, but she didn&#8217;t think she would be able to find anything that paid enough to keep up with our rent hike. I told her, &#8220;Let&#8217;s just move then. Nothing is worth you feeling like this.&#8221;  She thought I meant to another apartment in L.A., but when I suggested we leave California and find somewhere out in the country to homestead, it was the first time she looked truly relieved in months.`;
          break;
        case "8":
          textDialog.value = `Our first year homesteading in Virginia was beautiful and unforgiving. There was joy and heartache and the luxury of boredom. There was powdery mildew and blackberries and toil and chickens. We lived in a doublewide trailer on 10 acres of land that no one wanted. We collected rain water and grew and canned enough vegetables to feed ourselves that winter. It was Jen&#8217;s idea to plant a half acre of sunflowers and zinnias, which not only looked beautiful but was also a decent source of income. People would come and pick their own bouquets and buy some veggies while they were already there. I watched my wife wake back up to herself again. She was tired in a way that was satisfying. She began creating again.`;
          break;
        case "9":
          flipbookDisplay.value = true;
          break;
        case "10":
          showLockedDrawerDialog.value = true;
          lockedCode.value = "";
          break;
        case "11":
          textDialog.value = `Jen found a nest of baby rabbits. She knew to leave them alone under normal circumstances, but their mother never returned. The nearest wild rehabilitation was already at capacity, so she bottle fed them every two hours for eight days, only taking breaks when I could relieve her for a nap. We lost one of them, but the others managed to survive long enough to feed themselves. She built them a rabbit hutch in the backyard and frequently brought them inside to play. She cared for them for over a year.<br>
          <br>
          All it took was one time for me to forget to latch the hutch for a fox to get inside. It was such a small and simple thing. I don&#8217;t even remember what distracted me. We woke up to the sound of their screams. I immediately knew what was happening and told her &#8220;don&#8217;t look&#8221; and that I would take care of it, but she very tenderly gathered them up in an old dress and buried them herself. Then she didn&#8217;t speak to me or leave the bed for three days. I still haven&#8217;t forgiven myself.`;
          break;
        case "12":
          textDialog.value = `The only time I&#8217;ve ever heard Jen sing in nearly ten years of knowing her was secretly. And to the tomatoes. She would make up these silly little songs to encourage them to grow and I hid behind the screen door, straining to hear all the words. Her singing wasn&#8217;t great, but it was just so sweet. I loved it. I wish I had told her that, but I think she probably would have stopped if I had.`;
          break;
        case "13":
          textDialog.value = `Our second year in Virginia my older sister, Patty, was diagnosed with breast cancer. Emily&#8217;s dad wasn&#8217;t in the picture and Patty didn&#8217;t have the energy to take care of Emily alone while she underwent chemo, so they came to live with us for the summer. I remember how natural Jen was with Emily. She knew how to talk to her without talking down to or over her. There was an ease between them that I couldn&#8217;t fake even though I tried. I felt embarrassed because she was my niece, but in hindsight I think Emily was too scared that her mom might die to notice my awkwardness. I did what I could to distract her with something fun by creating increasingly elaborate scavenger hunts and by helping her direct her first movie on an old camcorder I got at an estate sale. We gave them our bedroom and slept on an air mattress in the living room. I remember Jen whispering while they were sleeping that we should be prepared to adopt Emily if Patty dies. I agreed, but I was terrified.`;
          break;
        case "14":
          soundPlaying.value = sounds.proposalAudio;
          sounds.backgroundMusic.sound.value.fade(MAX_LEVEL, 0, FADE_OUT);
          setTimeout(() => {
            sounds.backgroundMusic.pause();
          }, FADE_OUT);
          bgm_pos = sounds.backgroundMusic.sound.value.seek();
          break;
        case "15":
          textDialog.value = `She could be secretive. She never copped to smoking the whole time I knew her, but I would occasionally find a pack hidden in an odd place or a butt snuffed out in a flower pot. I was concerned for her health, but I was fine with it. It seemed infrequent enough, but I don&#8217;t know why she felt the need to hide it from me.`;
          break;
        case "16":
          imageDisplay.value = letterImage;
          break;
        case "19":
          textDialog.value = `After Emily stayed with us the summer Patty was sick, Jen told me she realized she wanted to have a child. I felt betrayed. I asked her what was so wrong with our life that she felt she needed a kid to fix it. I didn&#8217;t want to get left behind, or worse, for her to realize I wouldn&#8217;t be a good dad. I was so afraid of losing her that I almost did. I&#8217;m not sure she should have stayed with me after that, but I&#8217;m glad that she did.`;
          break;
        case "20":
          soundPlaying.value = sounds.voicemailAudio;
          sounds.backgroundMusic.sound.value.fade(MAX_LEVEL, 0, FADE_OUT);
          setTimeout(() => {
            sounds.backgroundMusic.pause();
          }, FADE_OUT);
          bgm_pos = sounds.backgroundMusic.sound.value.seek();
          break;
        case "22":
          textDialog.value = `I found out she was pregnant from the coroner. When was she planning to tell me? Was she going to go through with it? Did she even know?`;
          break;
        case "23":
          textDialog.value = `I keep growing older but you are always thirty-two. I didn&#8217;t think about it at first, but the gap between us keeps widening. Sometimes I think about a future memory that doesn&#8217;t exist. It&#8217;s very simple. Just a  5-second film reel of lines stretching across your face as you smile at me, silver threading through your hair. You&#8217;re gorgeous.`;
          break;
        default:
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
body {
  color: black;
  background-color: #8f950b;
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
  z-index: 1000;
}
.modal-dim {
  background-color: rgba(0, 0, 0, 0.85);
  transition: opacity 0.3s ease;
}

.modal-container {
  width: 300px;
}

@media only screen and (max-width: 600px) {
  .modal-container-large {
    width: 100%;
    height: 100vh;
  }
  .w-50 {
    width: 100%;
  }
}

@media only screen and (min-width: 601px) {
  .modal-container-large {
    width: 45%;
  }
  .w-50 {
    width: 50%;
  }
}

.modal-container-large {
  position: absolute;
  z-index: 1000;
}

@font-face {
  font-family: "Typewriter";
  font-style: normal;
  font-weight: normal;
  src: url("./assets/fonts/typewriter.ttf") format("truetype");
}

.modal-container,
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
  margin: 20px 0;
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

h3 {
    font-family: 'Typewriter', 'Courier New', Courier, monospace;
  }

@media only screen and (max-width: 720px) {
  .app-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100vh;
  }
  h3 {
    font-size: 2.5rem !important;
  }
}

@media only screen and (min-width: 721px) {
  .app-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 1024px;
    width: 75%;
    height: 100vh;
    margin: auto;
  }
  h3 {
    font-size: 3.5rem !important;
    padding-bottom: 1vh;
  }
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
</style>