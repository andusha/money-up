<template>
  <div
    class="window-height window-width row justify-center items-center primary-bg"
  >
    <div class="column q-pa-lg">
      <div class="row">
        <q-card square class="shadow-24" style="width: 400px">
          <q-card-section class="bg-accent">
            <h4 class="text-h5 text-white q-my-md">{{ title }}</h4>
          </q-card-section>
          <q-card-section>
            <q-fab
              color="primary"
              @click="switchTypeForm"
              icon="add"
              class="absolute"
              style="top: 0; right: 12px; transform: translateY(-50%)"
            >
              <q-tooltip> Регистрация нового пользователя </q-tooltip>
            </q-fab>
            <q-form class="q-px-sm q-pt-xl" @submit="submit">
              <q-input
                ref="emailValidate"
                square
                clearable
                v-model="email"
                type="email"
                lazy-rules
                :rules="[required, isEmail, short]"
                label="Email"
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
              <q-input
                ref="passwordValidate"
                square
                clearable
                v-model="password"
                :type="passwordFieldType"
                lazy-rules
                :rules="[required, short]"
                label="Пароль"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="visibilityIcon"
                    @click="switchVisibility"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
              <q-input
                ref="repasswordValidate"
                v-if="register"
                square
                clearable
                v-model="repassword"
                :type="passwordFieldType"
                lazy-rules
                :rules="[required, short, diffPassword]"
                label="Повторить пароль"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="visibilityIcon"
                    @click="switchVisibility"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
            </q-form>
          </q-card-section>

          <q-card-actions class="q-px-lg q-pb-lg">
            <q-btn
              unelevated
              size="lg"
              color="primary"
              @click="submit"
              class="full-width text-white"
              type="submit"
              :label="btnLabel"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
export default defineComponent({
  name: "AuthenticationPage",
  setup() {
    const authStore = useAuthStore();

    const router = useRouter();

    const title = ref("Авторизация");
    const email = ref("");
    const password = ref("");
    const repassword = ref("");
    const register = ref(false);
    const passwordFieldType = ref("password");
    const btnLabel = ref("Вход");
    const visibility = ref(false);
    const visibilityIcon = ref("visibility");

    const emailValidate = ref(null);
    const passwordValidate = ref(null);
    const repasswordValidate = ref(null);

    const $q = useQuasar();

    const registration = async (email, password) => {
      await authStore.signup(email, password);
      await authStore.login(email, password);
      router.push({ path: "/" });
    };

    const login = async (email, password) => {
      await authStore.login(email, password);
      router.push({ path: "/" });
    };
    watch(
      () => authStore.msg,
      () => {
        $q.notify({
          icon: authStore.msg.icon,
          color: authStore.msg.color,
          message: authStore.msg.msg,
        });
      }
    );
    return {
      title,
      email,
      password,
      repassword,
      register,
      passwordFieldType,
      btnLabel,
      visibility,
      visibilityIcon,
      emailValidate,
      passwordValidate,
      repasswordValidate,

      required(val) {
        return (val && val.length > 0) || "Поле должно быть заполнено";
      },
      diffPassword(val) {
        const val2 = password.value;
        return (val && val === val2) || "Пароль не совпадает!";
      },
      short(val) {
        return (val && val.length > 3) || "Значение слишком короткое";
      },
      isEmail(val) {
        const emailPattern =
          /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
        return emailPattern.test(val) || "Введите корректный email";
      },
      submit() {
        if (register.value) {
          emailValidate.value.validate();
          passwordValidate.value.validate();
          repasswordValidate.value.validate();
          if (
            !emailValidate.value.hasError &&
            !passwordValidate.value.hasError &&
            !repasswordValidate.value.hasError
          ) {
            registration(email.value, password.value);
          }
        } else {
          emailValidate.value.validate();
          passwordValidate.value.validate();
        }

        if (!register.value) {
          if (!emailValidate.value.hasError && !passwordValidate.value.hasError)
            login(email.value, password.value);
        }
      },
      switchTypeForm() {
        console.log(register, register.value, !register.value);
        register.value = !register.value;
        title.value = register.value ? "Новый пользователь" : "Авторизация";
        btnLabel.value = register.value ? "Регистрация" : "Вход";
      },
      switchVisibility() {
        visibility.value = !visibility.value;
        passwordFieldType.value = visibility.value ? "text" : "password";
        visibilityIcon.value = visibility.value
          ? "visibility_off"
          : "visibility";
      },
    };
  },
});
</script>

<style></style>
