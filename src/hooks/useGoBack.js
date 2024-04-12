import { unref } from "vue";
import { useRoute } from "vue-router";

export default function useGoBack(options = { autoBack: true, fallBack: '/' }) {
    const router = useRoute()

    const { autoBack = true, fallBack = '/' } = options
    const goBack = () => {
        if (!autoBack) return

        if (window.history.length === 2 && !window.history.state.back) {
            return router.replace(unref(fallBack))
        }
        router.go(-1)
    }
    return {
        goBack,
    }
}