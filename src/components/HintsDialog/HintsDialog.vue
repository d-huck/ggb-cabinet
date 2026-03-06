<template>
  <Transition name="help-modal">
    <div v-if="showHelpDialog" class="help-modal-wrapper" @click="closeHelpDialog">
      <div class="help-modal-container" @click.stop="doNothing">
        <div class="help-modal-header">
          <h3>Need Help?</h3>
          <XMarkIcon
            class="size-6 text-black-500 float-right cursor-pointer"
            @click="closeHelpDialog"
          />
        </div>
        <div class="help-modal-body">
          <div class="help-hints">
            <details>
              <summary>I've explored all the drawers. Now what?</summary>
              <p>Drawer 10 wants a password.</p>
              <div class="help-subhints">
                <details>
                  <summary>How can I find the password?</summary>
                  <p>Read the letter in drawer 16.</p>
                </details>
                <details>
                  <summary>What's the password?</summary>
                  <p>04/15/2015</p>
                </details>
              </div>
            </details>
            <details>
              <summary>I want to skip to the end. Where do I go for Part 2?</summary>
              <p>
                Go next to BottleMark, 9018 Ruland Road, Unit E. At your
                appointment time, call Mikey at 832-907-3788 to let you into
                Henry's trailer.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <button
    v-if="enabled"
    aria-label="Need Help?"
    title="Need Help?"
    class="help-button"
    @click="openHelpDialog"
  >
    Need Help?
  </button>
</template>

<script>
import { defineComponent, ref } from "vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";

export default defineComponent({
  name: "HintsDialog",
  components: {
    XMarkIcon,
  },
  props: {
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const showHelpDialog = ref(false);

    const openHelpDialog = () => {
      showHelpDialog.value = true;
    };

    const closeHelpDialog = () => {
      showHelpDialog.value = false;
    };

    const doNothing = () => {
      // Do nothing
    };

    return {
      showHelpDialog,
      openHelpDialog,
      closeHelpDialog,
      doNothing,
    };
  },
});
</script>

<style>
.help-button {
  position: fixed;
  right: 14px;
  bottom: 14px;
  height: 40px;
  padding: 0 14px;
  border-radius: 9999px;
  background: #f3e3b2;
  border: 2px solid rgba(0, 0, 0, 0.15);
  color: #000;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.35);
  font-family: "Typewriter", "Courier New", Courier, monospace;
  font-weight: bold;
  cursor: pointer;
  z-index: 1100;
}

.help-modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 1200;
}

.help-modal-container {
  margin: auto;
  padding: 20px 30px;
  background-color: #f3e3b2;
  font-family: "Typewriter", "Courier New", Courier, monospace;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  width: min(780px, 90vw);
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.help-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.help-modal-header h3 {
  margin: 0;
  font-size: 1.2rem !important;
}

.help-modal-body {
  margin: 12px 0 0;
  padding-right: 4px;
  overflow-y: auto;
}

.help-hints {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.help-hints details {
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 2px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.28);
}

.help-hints summary {
  cursor: pointer;
  font-weight: bold;
}

.help-hints p {
  margin: 10px 0 0;
}

.help-subhints {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.help-subhints details {
  margin-left: 8px;
  background: rgba(255, 255, 255, 0.4);
}

.help-modal-enter-from,
.help-modal-leave-to {
  opacity: 0;
}

.help-modal-enter-from .help-modal-container,
.help-modal-leave-to .help-modal-container {
  transform: scale(1.05);
}
</style>