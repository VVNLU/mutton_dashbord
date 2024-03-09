<template>
    <q-layout>
        <q-page-container>
            <q-page class="bg-page flex flex-center">
                <q-card class="bg-card q-pb- w-3/10 <sm:w-4/5 <md:w-3/5">
                    <q-card-section>
                        <div class="text-center q-pt-lg">
                            <span class="text-h4 text-bold">羊肉爐後台管理</span>
                        </div>
                    </q-card-section>
                    <q-card-section>
                        <account-input />
                        <password-input />
                        <confirm-button :width="'100%'" />
                    </q-card-section>
                </q-card>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<style scoped>
.bg-page {
    background-image: linear-gradient(180deg,
            #e9dac6 0%,
            #d3c2a5 50%,
            #C5A883 100%);
}

.bg-card {
    background-color: #efe4d4;
}
</style>