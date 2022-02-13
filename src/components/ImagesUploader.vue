<template>
  <div class="image-uploader">
    <div class="image-uploader__wrapper">
      <form
        @submit.prevent="submitImages"
        class="image-uploader__buttons">
        <button
          v-if="submitted || error"
          class="btn"
          @click="reset"
          type="button"
        >
          Сбросить
        </button>
        <template v-else>
          <button
            class="btn"
            @click="addFiles"
            type="button"
            :disabled="submitting"
          >
            Загрузить с устройства
          </button>
          <button
            v-if="images.length"
            class="btn"
            type="submit"
            :disabled="submitting"
          >
            Отправить
          </button>
        </template>
      </form>
      <div class="image-uploader__status">
        <template v-if="submitting">
          Отправляем...
        </template>
        <template v-else-if="submitted">
          Отправлено!
        </template>
        <template v-else-if="error">
          Ошибка: {{error}}
        </template>
      </div>
      <div class="preview">
        <div class="preview__container">
          <div
            class="preview__image-container"
            v-for="(image, index) in images"
            :key="image.id"
          >
            <img
              class="preview__image"
              :src="image.preview"
              :alt="`Фотография ${index + 1}`"
            >
            <div class="preview__image-actions">
              <button
                v-if="index > 0"
                class="btn"
                @click="moveLeft(index)"
              >
                &lt;
              </button>
              <button
                v-if="index < images.length - 1"
                class="btn"
                @click="moveRight(index)"
              >
                &gt;
              </button>
            </div>
            <button
              class="preview__btn-remove"
              @click="removeImage(index)"
              v-if="!submitted && !error && !submitting"
            >
              <img
                src="../assets/close.svg"
                alt=""
                class="btn-remove__img"
              >
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'ImagesUploader',
  data() {
    return {
      images: [],
      submitting: false,
      submitted: false,
      error: null,
    };
  },
  methods: {
    ...mapActions(['uploadImages']),
    addFiles() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = true;
      input.addEventListener('change', () => {
        this.images.push(
          ...Array.from(input.files).map((file) => ({
            file,
            id: Math.random().toString(36).substring(2, 7),
            preview: URL.createObjectURL(file),
          })),
        );
        input.remove();
      });
      input.addEventListener('error', input.remove);
      input.click();
    },
    removeImage(index) {
      if (index in this.images) {
        this.images.splice(index, 1);
      }
    },
    async submitImages() {
      this.submitting = true;
      this.submitted = false;
      const formData = new FormData();

      this.images.forEach((image) => {
        formData.append('file[]', image.file);
      });

      try {
        await this.uploadImages(formData);
        this.submitted = true;
      } catch (e) {
        this.error = e.message;
      } finally {
        this.submitting = false;
      }
    },
    moveTo(index, newIndex) {
      const image = this.images[index];
      this.images.splice(index, 1);

      this.images.splice(
        newIndex,
        0,
        image,
      );
    },
    moveLeft(index) {
      if (index === 0) {
        return;
      }
      this.moveTo(index, index - 1);
    },
    moveRight(index) {
      if (index === this.images.length - 1) {
        return;
      }
      this.moveTo(index, index + 1);
    },
    reset() {
      this.submitting = false;
      this.submitted = false;
      this.error = null;
      this.images = [];
    },
  },
};
</script>
