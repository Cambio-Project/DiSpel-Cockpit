<script setup lang="ts">
const show = ref(false)
const props = defineProps({
      deleteName: {
        type: String,
        default: 'this item'
      },
      altButton: {
        type: Boolean,
        default: false
      },
      altButtonText: {
        type: String,
        default: 'Delete'
      }
    }
)
const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <UButton class="mr-1" icon="i-heroicons-trash-16-solid" square size="xs" color="red"
           @click="show = true" v-if="!altButton"/>
  <UButton class="mr-1" color="red" @click="show = true" v-if="altButton" >{{ altButtonText }}</UButton>
  <UModal v-model="show">
    <UCard>
      <template #header>
        <div class="font-bold">Confirm Delete</div>
      </template>
      <p>Are you sure you want to delete {{ deleteName }}? </p>
      <p>This cannot be undone!</p>
      <template #footer>
        <div class="flex justify-end gap-4">
          <UButton @click="show = false; emit('cancel')" color="blue">Cancel</UButton>
          <UButton @click="show = false; emit('confirm')" color="red">Delete</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
