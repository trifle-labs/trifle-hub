<template>
  <component
    :is="
      quest.link && !isTwitterEngagement ? (typeof quest.link === 'string' ? 'a' : 'button') : 'div'
    "
    :fid="quest.fid"
    :href="typeof quest.link === 'string' && !isTwitterEngagement ? quest.link : undefined"
    :target="typeof quest.link === 'string' && !isTwitterEngagement ? '_blank' : undefined"
    :rel="
      typeof quest.link === 'string' && !isTwitterEngagement ? 'noopener noreferrer' : undefined
    "
    @click="handleClick"
    class="_w-full _block _relative"
    :id="'thub-quest-' + quest.id"
    :class="{
      '_pointer-events-none': quest.completed && quest.once,
      '_origin-center _animate-quest-highlight-pop _delay-500 _z-10 _relative': highlight
    }"
  >
    <!-- main body, faded if completed -->
    <div
      class="_bg-metallic-linear _shadow-panel _w-full _p-2 _px-2.5 _pr-3 _rounded-lg _transition-colors _relative _flex _flex-col _gap-0.5 _min-h-14 _justify-center"
      :class="[
        {
          'mouse:hover:_scale-[1.006] _duration-100': quest.link,
          '_opacity-40': quest.completed && quest.once
        }
      ]"
    >
      <header class="_flex _w-full _gap-2.5 _cursor-pointer _min-w-0 _items-stretch">
        <div class="_size-9 _flex-shrink-0">
          <img :src="quest.icon" class="_w-full _h-full _rounded-lg _block" />
        </div>
        <div class="_flex-1 _min-w-0 _flex _flex-col _justify-center _min-h-8 _text-left _leading-normal">
          <div
            class="_min-w-0 _leading-[1.1] _text-stroke-xl _truncate"
            :class="{ '_line-through': quest.completed && quest.once }"
          >
            {{ quest.name }}
          </div>
        </div>
        <div class="_flex _items-center _h-9 _gap-0.5 _relative _text-em-sm sm:_text-mlg _flex-shrink-0">
          <div
            v-if="!quest.enabled"
            class="_rounded-full _bg-metallic-cone _shadow-panel _px-[0.5em]"
          >
            soon
          </div>
          <div
            v-else
            class="_rounded-full _bg-metallic-cone _shadow-panel _pr-[0.5em] _pl-[0.25em] _flex _gap-[0.1em]"
          >
            <div>🪩</div>
            <span>{{ quest.pachinkoBalls }}</span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="black"
            stroke-width="0.75"
            stroke="black"
            class="_size-6 sm:_size-7 _opacity-30 sm:_ml-0.5"
            :class="[
              {
                '_invisible _ml-4.5': quest.completed && quest.once,
                '_rotate-90': isTwitterEngagement && expanded
              }
            ]"
          >
            <path
              fill-rule="evenodd"
              d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </header>
      <div
        v-if="quest.description && !(isTwitterEngagement && expanded)"
        class="_flex _items-start _gap-3 _pr-3"
      >
        <div class="_w-9 _flex-shrink-0"></div>
        <p
          class="_flex-1 _text-em-xs _text-zinc-500 _text-stroke-lg _text-left"
          v-html="quest.description"
        ></p>
      </div>
      <TwitterEngagementQuest
        v-if="isTwitterEngagement && expanded"
        :mode="
          quest.id === 'twitter-like-tweet'
            ? 'like'
            : quest.id === 'twitter-reply-tweet'
              ? 'reply'
              : 'follow'
        "
        @points-updated="$emit('points-updated')"
      />
    </div>
    <div
      v-if="quest.completed && quest.once"
      class="_absolute _top-0 _right-1 _flex _items-center _justify-center"
    >
      <img src="../assets/imgs/checkmark-icon-glass.png" class="_size-[2.5em]" />
    </div>
  </component>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import TwitterEngagementQuest from './TwitterEngagementQuest.vue'

const props = defineProps({
  quest: { type: Object, required: true },
  highlight: { type: Boolean, default: false }
})

defineEmits(['points-updated', 'internal-link'])

const hub = inject('hub')
const { openHub } = hub

const expanded = ref(false)

const isTwitterEngagement = computed(() => {
  const id = props.quest.id
  return (
    id === 'twitter-like-tweet' || id === 'twitter-reply-tweet' || id === 'follow-trifle-twitter'
  )
})

const handleClick = (e) => {
  if (isTwitterEngagement.value) {
    expanded.value = !expanded.value
  } else if (props.quest.link?.to) {
    openHub(props.quest.link.to)
  }
}
</script>
