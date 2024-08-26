<template>
  <Transition name="modal">
    <div v-if="!loaded" class="modal-mask">
      <div class="modal-container">
        <div class="modal-header">
          <slot name="header">Welcome</slot>
        </div>
        <div class="modal-body">
          <slot name="body">Body of modal dialog</slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <button
              class="modal-default-button"
              @click="closeWelcome"
            >OK</button>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
  <Transition name="modal">
    <div v-if="textDialog">
      <div class="modal-wrapper">
        <div class="modal-container-large over">
          <div class="modal-body">
            <slot name="body"><div v-html="textDialog"></div></slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button
                class="modal-default-button"
                @click="closeTextDialog"
              >OK</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
  <Transition name="modal">
    <div v-if="showLockedDrawerDialog">
      <div class="modal-wrapper">
        <div class="modal-container-large over">
          <div class="modal-body">
            <slot name="body">
              <div class="w-full">
                <div class="mt-10 grid grid-cols-12 gap-x-6 gap-y-8">
                  <div class="col-span-2">
                    <input
                      class="w-full"
                      type="text"
                      maxlength="2"
                      pattern="[0-9]*"
                      inputmode="numeric"
                      v-model="lockedCode1"
                      ref="lockedCode1Field"
                    />
                  </div>
                  <div class="col-span-2">
                    &nbsp;/&nbsp;
                  </div>
                  <div class="col-span-2">
                    <input
                      class="w-full"
                      type="text"
                      maxlength="2"
                      pattern="[0-9]*"
                      inputmode="numeric"
                      v-model="lockedCode2"
                      ref="lockedCode2Field"
                    />
                  </div>
                  <div class="col-span-2">
                    &nbsp;/&nbsp;
                  </div>
                  <div class="col-span-4">
                    <input
                      class="w-full"
                      type="text"
                      maxlength="4"
                      pattern="[0-9]*"
                      inputmode="numeric"
                      v-model="lockedCode3"
                      ref="lockedCode3Field"
                    />
                  </div>
                </div> <!-- class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12" -->
              </div> <!-- class="w-full" -->
            </slot>
          </div>
          <div class="modal-footer">
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
    <div v-if="flipbookDisplay" class="modal-wrapper">
      <div class="modal-container-large">
        <div class="modal-body">
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
                            <div class="relative mx-auto">
                                <vue-flip active-click width="100%" height="400px" transition="1.0s">
                                  <template v-slot:front>
                                    <div class="w-full relative mx-auto">
                                      <img :src="slotProps.data.front" class="h-400 rounded mx-auto" />
                                    </div>
                                  </template>
                                  <template v-slot:back>
                                    <div class="w-full relative mx-auto">
                                      <img :src="slotProps.data.back" class="h-400 rounded mx-auto" />
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
        <div class="modal-footer">
          <slot name="footer">
            <button
              class="modal-default-button"
              @click="closeFlipbook"
            >OK</button>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
  <Transition name="modal">
    <div v-if="imageDisplay" class="modal-wrapper">
      <div class="modal-container-large">
        <div class="modal-body">
          <slot name="body">
            <div class="card">
              <div class="w-full relative mx-auto">
                <img :src="imageDisplay" class="h-400 rounded mx-auto" />
              </div>
            </div>
          </slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <button
              class="modal-default-button"
              @click="closeImage"
            >OK</button>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
  <Transition name="modal">
    <div v-if="videoDisplay" class="modal-wrapper">
      <div class="modal-container-large">
        <div class="modal-body">
          <slot name="body">
            <div class="card">
              <VideoPlayer :options="videoOptions" />
            </div>
          </slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <button
              class="modal-default-button"
              @click="closeVideo"
            >OK</button>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
  <div class="mapper-container" ref="container" v-if="loaded">
    <ImageMapper
      :src="src"
      :map="map"
      :width="parentWidth"
      :imgWidth="2500"
      :parentWidth="parentWidth"
      :responsive="true"
      @click="handleImageMapClick"
    />
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref, shallowReactive, watch } from "vue";
import Carousel from "primevue/carousel";
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
import backgroundMusic from './assets/audio/background_music.mp3';
import pianoAudio from './assets/audio/piano_memory.m4a';
import proposalAudio from './assets/audio/proposal_temp_audio.mp3';
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
import cabinetImage from './assets/images/cabinet.jpg';

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
    VideoPlayer,
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
      parentWidth.value = container.value.clientWidth;
    };
    let backgroundMusicArgs = useSound(backgroundMusic);
    let pianoAudioArgs = useSound(pianoAudio);
    let proposalAudioArgs = useSound(proposalAudio);
    let voicemailAudioArgs = useSound(voicemailAudio);
    let drawerOpenAArgs = useSound(drawerOpenA);
    let drawerOpenBArgs = useSound(drawerOpenB);
    let drawerOpenCArgs = useSound(drawerOpenC);
    let drawerCloseAArgs = useSound(drawerCloseA);
    let drawerCloseBArgs = useSound(drawerCloseB);
    let drawerCloseCArgs = useSound(drawerCloseC);
    let drawerStuckAArgs = useSound(drawerStuckA);
    let drawerStuckBArgs = useSound(drawerStuckB);
    let drawerStuckCArgs = useSound(drawerStuckC);

    const sounds = {
      backgroundMusic: {
        play: backgroundMusicArgs.play,
        stop: backgroundMusicArgs.stop,
        sound: backgroundMusicArgs.sound
      },
      pianoAudio: {
        play: pianoAudioArgs.play,
        stop: pianoAudioArgs.stop,
        sound: pianoAudioArgs.sound
      },
      proposalAudio: {
        play: proposalAudioArgs.play,
        stop: proposalAudioArgs.stop,
        sound: proposalAudioArgs.sound
      },
      voicemailAudio: {
        play: voicemailAudioArgs.play,
        stop: voicemailAudioArgs.stop,
        sound: voicemailAudioArgs.sound
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
    const videoDisplay = ref(null);
    const videoOptions = ref({});
    const showLockedDrawerDialog = ref(false);
    const lockedCode1 = ref("");
    const lockedCode2 = ref("");
    const lockedCode3 = ref("");
    const lockedCode1Field = ref(null);
    const lockedCode2Field = ref(null);
    const lockedCode3Field = ref(null);
    watch(lockedCode1, (newValue) => {
      if (lockedCode1.value.length === 2) {
        lockedCode2Field.value.focus();
      }
    });
    watch(lockedCode2, (newValue) => {
      if (lockedCode2.value.length === 2) {
        lockedCode3Field.value.focus();
      }
    });
    let soundPlaying = null;
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
        areasData.value = areas;
        sounds.backgroundMusic.play();
        handleResize();
      }, 50);
    };

    const closeTextDialog = () => {
      let choice = Math.floor(Math.random()*sounds.drawer.close.length);
      sounds.drawer.close[choice]();
      textDialog.value = null;
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

    const closeVideo = () => {
      console.log("Closing video");
      let choice = Math.floor(Math.random()*sounds.drawer.close.length);
      sounds.drawer.close[choice]();
      videoDisplay.value = null;
      videoOptions.value = {};
      sounds.backgroundMusic.sound.value.fade(0, 1, 0);
      sounds.backgroundMusic.play();
    };

    const submitCode = () => {
      let lockedCode = lockedCode1.value + "/" + lockedCode2.value + "/" + lockedCode3.value;
      if (lockedCode === "04/15/2015") {
        let phone = "";
        let address = "";
        let uri = window.location.search.substring(1); 
        let params = new URLSearchParams(uri);
        let dateTime = params.d ?? "";
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
      console.log(area, index);
      let choice = Math.floor(Math.random()*sounds.drawer.open.length);
      if (area.name !== "10") {
        sounds.drawer.open[choice]();
      } else {
        sounds.drawer.stuck[choice]();
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
          if (!soundPlaying) {
            console.log("Playing audio");
            soundPlaying = sounds.pianoAudio;
            soundPlaying.sound.value.fade(0, 1, 0);
            sounds.backgroundMusic.sound.value.fade(1, 0, 1000);
            setTimeout(() => {
              sounds.backgroundMusic.stop();
              soundPlaying.play();
            }, 1000);
          } else {
            soundPlaying.sound.value.fade(1, 0, 1000);
            setTimeout(() => {
              soundPlaying.stop();
              sounds.backgroundMusic.sound.value.fade(0, 1, 0);
              sounds.backgroundMusic.play();
              soundPlaying = null;
            }, 1000);
          }
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
          sounds.backgroundMusic.sound.value.fade(1, 0, 500);
          setTimeout(() => {
            sounds.backgroundMusic.stop();
          }, 500);
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
          lockedCode1.value = "";
          lockedCode2.value = "";
          lockedCode3.value = "";
          setTimeout(() => {
            lockedCode1Field.value.focus();
          }, 50);
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
          if (!soundPlaying) {
            soundPlaying = sounds.proposalAudio;
            soundPlaying.sound.value.fade(0, 1, 0);
            sounds.backgroundMusic.sound.value.fade(1, 0, 1000);
            setTimeout(() => {
              sounds.backgroundMusic.stop();
              soundPlaying.play();
            }, 1000);
          } else {
            soundPlaying.sound.value.fade(1, 0, 1000);
            setTimeout(() => {
              soundPlaying.stop();
              sounds.backgroundMusic.sound.value.fade(0, 1, 0);
              sounds.backgroundMusic.play();
              soundPlaying = null;
            }, 1000);
          }
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
          if (!soundPlaying) {
            soundPlaying = sounds.voicemailAudio;
            soundPlaying.sound.value.fade(0, 1, 0);
            sounds.backgroundMusic.sound.value.fade(1, 0, 1000);
            setTimeout(() => {
              sounds.backgroundMusic.stop();
              soundPlaying.play();
            }, 1000);
          } else {
            soundPlaying.sound.value.fade(1, 0, 1000);
            setTimeout(() => {
              soundPlaying.stop();
              sounds.backgroundMusic.sound.value.fade(0, 1, 0);
              sounds.backgroundMusic.play();
              soundPlaying = null;
            }, 1000);
          }
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
      closeFlipbook,
      closeImage,
      closeVideo,
      textDialog,
      flipbookDisplay,
      postcards,
      carouselOptions,
      imageDisplay,
      videoDisplay,
      videoOptions,
      showLockedDrawerDialog,
      submitCode,
      lockedCode1,
      lockedCode2,
      lockedCode3,
      lockedCode1Field,
      lockedCode2Field,
      lockedCode3Field,
      handleImageMapClick,
    };
  }
});
</script>

<style>
body {
  color: black;
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
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

.modal-container {
  width: 300px;
}

@media only screen and (max-width: 600px) {
  .modal-container-large {
    width: 100%;
  }
}

@media only screen and (min-width: 601px) {
  .modal-container-large {
    width: 75%;
  }
}

.modal-container-large {
  position: absolute;
  z-index: 1000;
}

/*
.modal-container.over,
.modal-container-large.over {
  position: absolute;
}
*/
.modal-container,
.modal-container-large {
  margin: auto;
  padding: 20px 30px;
  background-color: #fff;
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
.mapper-container {
  width: 100%;
}
.mx-auto {
  margin: 0 auto;
}
.h-400 {
  max-height: 400px;
  height: initial;
}
</style>